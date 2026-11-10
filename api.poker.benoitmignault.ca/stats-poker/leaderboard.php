<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Récupérer le paramètre min_presences et valider que c'est un entier
$minPresences = filter_var($_GET["min_presences"] ?? null, FILTER_VALIDATE_INT);

// Vérifier si le paramètre min_presences est absent ou invalide
if ($minPresences === false) {

	http_response_code(400);
	echo json_encode(["success" => false, "code" => "invalidMinPresences", "message" => "Le paramètre min_presences est absent ou invalide."]);
	exit();
}

// Établir la connexion à la base de données pour les statistiques de poker
$connMYSQL = connexionStatsDB();

// Classement général des joueurs ayant au moins le nombre de présences demandé :
// agrégats par joueur, avec les ratios par présence calculés en SQL.
// Le tri par défaut est celui de la version 1 (gain, victoires, 2e places, présences) ;
// le tri interactif par colonne se fait côté React.
$select = "SELECT j.id, j.joueur AS nom, COUNT(*) AS presences, SUM(p.gain) AS gain, SUM(p.victoire) AS victoires, SUM(p.fini_2e) AS fini2e, ROUND(SUM(p.gain) / COUNT(*), 2) AS gain_par_presence ";
$from = "FROM poker p INNER JOIN joueur j ON j.id = p.id_joueur ";
$groupBy = "GROUP BY j.id, j.joueur ";
$having = "HAVING COUNT(*) >= ? ";
$orderBy = "ORDER BY gain DESC, victoires DESC, fini2e DESC, presences ASC";
$sql = $select . $from . $groupBy . $having . $orderBy;

$stmtLeaderboard = $connMYSQL->prepare($sql);

// Vérification si la préparation de la requête a réussi
if ($stmtLeaderboard === false) {

	error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorPrepareQuery", "message" => "Une erreur est survenue lors de la préparation de la requête."]);
	$connMYSQL->close();
	exit();
}

// Lier le paramètre min_presences à la requête
$stmtLeaderboard->bind_param("i", $minPresences);

// Vérifier si l'exécution de la requête a réussi
if (!$stmtLeaderboard->execute()) {

	error_log("Erreur lors de l'exécution de la requête: " . $stmtLeaderboard->error);
	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorExecuteQuery", "message" => "Une erreur est survenue lors de l'exécution de la requête."]);
	$stmtLeaderboard->close();
	$connMYSQL->close();
	exit();
}

$resultLeaderboard = $stmtLeaderboard->get_result();

// Créer un tableau pour stocker les lignes du classement
$leaderboard = [];

// Parcourir les résultats de la requête et ajouter chaque joueur au tableau
while ($row = $resultLeaderboard->fetch_assoc()) {

	// Ajouter chaque joueur au tableau (types normalisés pour le JavaScript)
	$leaderboard[] = [
		"id" => (int) $row["id"],
		"nom" => $row["nom"],
		"presences" => (int) $row["presences"],
		"gain" => (int) $row["gain"],
		"victoires" => (int) $row["victoires"],
		"fini2e" => (int) $row["fini2e"],
		"gainParPresence" => (float) $row["gain_par_presence"]
	];
}

// Fermer la requête préparée
$stmtLeaderboard->close();

http_response_code(200);

// Retourner les données au format JSON :
echo json_encode(["success" => true, "leaderboard" => $leaderboard]);

// Fermer la connexion à la base de données
$connMYSQL->close();
