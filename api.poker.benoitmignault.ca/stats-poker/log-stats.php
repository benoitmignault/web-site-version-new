<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Récupération des données JSON envoyées par le client
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si les données ont été reçues
if (!$data) {

	error_log("log-stats.php : aucune donnée reçue ou JSON invalide.");
	http_response_code(400);
	echo json_encode(["success" => false, "code" => "errorNoData", "message" => "Aucune donnée reçue."]);

	exit();
}

// Avant d'aller plus loin, on doit valider si le log doit etre prise en compte ou ignorer
if (isset($data["exclude_stats"]) && $data["exclude_stats"] === true) {

	http_response_code(200);
	echo json_encode(["success" => true, "code" => "statsExcluded", "message" => "Statistiques exclues."]);

	exit();
}

// Validation des champs reçus : types et valeurs avant tout traitement
$actionType = $data["action_type"] ?? null;
$actionName = $data["action_name"] ?? null;

// Définir les types d'action valides
$validActionTypes = ["page_load", "view_load"];

if (!is_string($actionType) || !in_array($actionType, $validActionTypes, true) || !is_string($actionName) || strlen($actionName) > 255) {

	error_log("log-stats.php : champs invalides reçus : " . var_export($data, true));
	http_response_code(400);
	echo json_encode(["success" => false, "code" => "errorInvalidData", "message" => "Données invalides."]);
	exit();
}

// Les trois sous-options sont optionnelles (NULL selon la vue) ;
// si présentes, elles doivent être un entier >= 1
$rawPlayerId = $data["player_id"] ?? null;
$rawTournamentId = $data["tournament_id"] ?? null;
$rawMinPresences = $data["min_presences"] ?? null;

if ($rawPlayerId === null) {

	$playerId = null;
} else {

	$playerId = filter_var($rawPlayerId, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

	if ($playerId === false) {
		error_log("Valeur brute reçue pour player_id : " . var_export($rawPlayerId, true));
		http_response_code(400);
		echo json_encode(["success" => false, "code" => "errorInvalidPlayerId", "message" => "ID du joueur invalide."]);
		exit;
	}
}

if ($rawTournamentId === null) {

	$tournamentId = null;
} else {

	$tournamentId = filter_var($rawTournamentId, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

	if ($tournamentId === false) {
		error_log("Valeur brute reçue pour tournament_id : " . var_export($rawTournamentId, true));
		http_response_code(400);
		echo json_encode(["success" => false, "code" => "errorInvalidTournamentId", "message" => "ID du tournoi invalide."]);
		exit;
	}
}

if ($rawMinPresences === null) {

	$minPresences = null;
} else {

	$minPresences = filter_var($rawMinPresences, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

	if ($minPresences === false) {
		error_log("Valeur brute reçue pour min_presences : " . var_export($rawMinPresences, true));
		http_response_code(400);
		echo json_encode(["success" => false, "code" => "errorInvalidMinPresences", "message" => "Minimum de présences invalide."]);
		exit;
	}
}

// Récupérer l'adresse IP du client
$ipAddress = $_SERVER['REMOTE_ADDR'];

// Établir la connexion à la base de données des statistiques de poker
$connMYSQL = connexionStatsDB();

// Requête SQL pour insérer un nouveau log dans la table stats_logs
// Amélioration, on va gérer la date du timestamp directement dans la base de données
$sql = "INSERT INTO stats_logs (action_type, action_name, player_id, tournament_id, min_presences, ip_address) VALUES (?, ?, ?, ?, ?, ?)";

// Préparer la requête SQL
$stmt = $connMYSQL->prepare($sql);

// Vérification si la préparation de la requête a réussi
if ($stmt === false) {

	error_log($connMYSQL->error);

	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorPrepareQuery", "message" => "Erreur lors de la préparation de la requête."]);

	$connMYSQL->close();
	exit();
}

// Lier les paramètres à la requête préparée
$stmt->bind_param("ssiiis", $actionType, $actionName, $playerId, $tournamentId, $minPresences, $ipAddress);

// Exécuter la requête SQL pour insérer le nouveau log dans la base de données
if (!$stmt->execute()) {

	error_log("LOG STATS : " . $actionType . " | " . $actionName . " | " . date("Y-m-d H:i:s"));

	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorInsertLog", "message" => "Erreur lors de l'ajout du log."]);

	// Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
	$stmt->close();
	$connMYSQL->close();
	exit();
}

// Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
$stmt->close();
$connMYSQL->close();

http_response_code(201);
echo json_encode(["success" => true, "message" => "Log ajouté avec succès."]);
