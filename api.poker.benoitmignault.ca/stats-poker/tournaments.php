<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Établir la connexion à la base de données pour les statistiques de poker
$connMYSQL = connexionStatsDB();

// Requête SQl pour récupérer la lsite des tournois de manière décroissante (du plus récent au plus ancien) 
// avec leur date et leur ID
$select = "SELECT distinct id_tournoi, date ";
$from = "FROM joueur ";
$orderBy = "ORDER BY id_tournoi desc";
$sql = $select . $from . $orderBy;

// Exécuter la requête SQL
$result = $connMYSQL->query($sql);

// Vérifier si la requête a réussi
if (!$result) {

	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorExecuteQuery", "message" => "Erreur lors de l'exécution de la requête."]);

	// Fermer la connexion à la base de données
	$connMYSQL->close();
	exit();
}

// Créer un tableau pour stocker les tournois
$tournaments = [];

// Parcourir les résultats de la requête et ajouter chaque tournoi au tableau
while ($row = $result->fetch_assoc()) {

	// Ajouter chaque tournois avec son id et la date du tournoi au tableau (id en entier pour le JavaScript)
	$tournaments[] = [
		"id" => (int)$row["id_tournoi"],
		"date" => $row["date"]
	];
}

http_response_code(200);

// Retourner les données au format JSON
echo json_encode(["success" => true, "tournaments" => $tournaments]);

// Fermer la connexion à la base de données
$connMYSQL->close();
