<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Récupération des données JSON envoyées par le client
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si les données ont été reçues
if (!$data) {

	error_log("log-timer.php : aucune donnée reçue ou JSON invalide.");
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

// Récupération de l'ID de l'organisateur : optionnel (absent = aucun organisateur sélectionné)
$rawOrganizerId = $data["organizer_id"] ?? null;

if ($rawOrganizerId === null) {

	// Aucun organisateur sélectionné : c'est valide, on continue avec null
	$organizerId = null;
} else {

	// Un id est présent : il doit être un entier >= 1
	$organizerId = filter_var($rawOrganizerId, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

	if ($organizerId === false) {
		error_log("Valeur brute reçue pour id : " . var_export($organizerId, true));
		http_response_code(400);
		echo json_encode(["success" => false, "code" => "errorInvalidOrganizer", "message" => "ID de l'organisateur invalide."]);
		exit;
	}
}

// Établier la connexion à la base de données pour les soirées de poker
$connMYSQL = connexionOrganizersDB();

// Récupérer les autres données envoyées par le frontend
$actionType = $data['action_type'];
$actionName = $data['action_name'];
// Récupérer l'adresse IP du client
$ipAddress = $_SERVER['REMOTE_ADDR'];

// Requête SQL pour insérer un nouveau log dans la table timer_logs
// Amélioration, on va gérer la date du timestamp directement dans la base de données avec NOW() pour éviter les problèmes de fuseau horaire
$sql = "INSERT INTO timer_logs (action_type, action_name, organizer_id, ip_address) VALUES (?, ?, ?, ?)";

// Préparer la requête SQL
$stmt = $connMYSQL->prepare($sql);

// Lier les paramètres à la requête préparée
$stmt->bind_param("ssis", $actionType, $actionName, $organizerId, $ipAddress);

// Exécuter la requête SQL pour insérer le nouveau log dans la base de données
if (!$stmt->execute()) {

    error_log("LOG TIMER : " . $actionType . " | " . $actionName . " | " . date("Y-m-d H:i:s"));

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
