<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Établir la connexion à la base de données pour les statistiques de poker
$connMYSQL = connexionStatsDB();

// Requête SQL pour récupérer la liste des joueurs avec leur nom et leur ID
// (la colonne du nom s'appelle "joueur" dans la table, on l'expose en "nom")
$select = "SELECT id, joueur AS nom ";
$from = "FROM joueur ";
$orderBy = "ORDER BY nom ASC";
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

// Créer un tableau pour stocker les joueurs
$players = [];

// Parcourir les résultats de la requête et ajouter chaque joueur au tableau
while ($row = $result->fetch_assoc()) {

	// Ajouter chaque joueur au tableau (id en entier pour le JavaScript)
	$players[] = [
		"id" => (int)$row["id"],
		"nom" => $row["nom"]
	];
}

http_response_code(200);

// Retourner les données au format JSON
echo json_encode(["success" => true, "players" => $players]);

// Fermer la connexion à la base de données
$connMYSQL->close();
