<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Établier la connexion à la base de données pour les soirées de poker
$connMYSQL = connexionOrganizersDB();

// Récupération de l'ID de l'organisateur depuis les paramètres GET
$organizerId = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

// Vérification si l'ID de l'organisateur est valide
if ($organizerId === false) {

    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID de l'organisateur invalide."]);

    // Fermer la connexion à la base de données
    $connMYSQL->close();
    exit();
}

// Requête SQL pour récupérer les informations sur les jetons de l'organisateur
$select = "SELECT ac.id, ac.amount, c.color_english, c.color_french ";
$from = "FROM amount_color ac INNER JOIN color c ON ac.id_color = c.id ";
$where = "WHERE ac.id_user = ? ";
$orderBy = "ORDER BY ac.amount";
$sql = $select . $from . $where . $orderBy;

// Préparation de la requête SQL
$stmt = $connMYSQL->prepare($sql);
$stmt->bind_param("i", $organizerId);

// Vérifier si la requête a réussi
if (!$stmt->execute()) {

    error_log($stmt->error);
    
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'exécution de la requête."]); 
    
    // Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
    $stmt->close();
    $connMYSQL->close();
    exit();
}

$result = $stmt->get_result();

// Ce n'est pas une erreur mais il n'y a pas de jetons pour cet organisateur
if ($result->num_rows === 0) {

    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Aucun jeton trouvé pour cet organisateur."]);

    // Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
    $stmt->close();
    $connMYSQL->close();
    exit();
}

// Récupération des résultats de la requête et création d'un tableau pour stocker les jetons
$chips = [];

while ($row = $result->fetch_assoc()) {

    // Ajouter chaque jeton au tableau
    $chips[] = $row;
}

http_response_code(200);

// Retourner les données au format JSON
echo json_encode(["success" => true, "chips" => $chips]);

// Fermer la connexion à la base de données
$stmt->close();
$connMYSQL->close();