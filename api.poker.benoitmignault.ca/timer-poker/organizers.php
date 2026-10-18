<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Établier la connexion à la base de données pour les soirées de poker
$connMYSQL = connexionOrganizersDB();

if (!$connMYSQL) {

    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]);

    exit();
}

// Requête SQl pour récupérer la lsite des organisateurs de soirées de poker avec leur nom e tleur ID
$select = "SELECT idUser, name ";
// Utilisation de LEFT JOIN pour inclure tous les joueurs, même ceux sans résultats de tournament
$from = "FROM login_organisateur ";
$orderBy = "ORDER name ASC";
$sql = $select . $from . $orderBy;

// Exécuter la requête SQL
$result = $connMYSQL->query($sql);

// Vérifier si la requête a réussi
if (!$result) {

    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'exécution de la requête."]);

    // Fermer la connexion à la base de données
    $connMYSQL->close();
    exit();
}

// Créer un tableau pour stocker les organisateurs
$organizers = [];

// Parcourir les résultats de la requête et ajouter chaque organisateur au tableau
while ($row = $result->fetch_assoc()) {

    // Ajouter chaque organisateur au tableau
    $organizers[] = $row;
}

http_response_code(200);

// Retourner les données au format JSON
echo json_encode(["success" => true, "organizers" => $organizers]);

// Fermer la connexion à la base de données
$connMYSQL->close();