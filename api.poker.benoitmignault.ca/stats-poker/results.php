<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Établir la connexion à la base de données pour les statistiques de poker
$connMYSQL = connexionStatsDB();

// Requête SQL pour récupérer tous les résultats :
$select = "SELECT p.id, j.joueur AS nom, p.id_tournoi, p.date, p.gain, p.victoire, p.fini_2e, p.killer, p.prix_citron ";
$from = "FROM poker p ";
$join = "LEFT JOIN joueur j ON j.id = p.id_joueur ";
// L'ordre de tri est : par id_tournoi décroissant, puis par prix_citron (les prix citron sont affichés en dernier), puis par gain décroissant, puis par killer décroissant, puis par nom du joueur.
$orderBy = "ORDER BY p.id_tournoi DESC, (p.prix_citron > 0) ASC, p.gain DESC, p.killer DESC, j.joueur ASC";

$sql = $select . $from . $join . $orderBy;

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

// Initialise un tableau vide pour stocker tous les résultats.
$results = [];

// Parcourir les résultats de la requête et ajouter chaque joueur au tableau
while ($row = $result->fetch_assoc()) {

    // Ajoute un résultat au tableau en normalisant les types pour l'application React.
	$results[] = [
		"id" => (int) $row["id"],
		"nom" => $row["nom"] ?? "",
		"idTournoi" => (int) $row["id_tournoi"],
		"date" => $row["date"],
		"gain" => (int) $row["gain"],
		"victoire" => (int) $row["victoire"],
		"fini2e" => (int) $row["fini_2e"],
		"killer" => (float) $row["killer"],
		"prixCitron" => (float) $row["prix_citron"]
	];
}

// Retourne la liste complète des résultats au format JSON attendu par l'application React.
http_response_code(200);

// Retourne les résultats au format JSON
echo json_encode(["success" => true, "results" => $results]);

// Fermer la connexion à la base de données
$connMYSQL->close();
