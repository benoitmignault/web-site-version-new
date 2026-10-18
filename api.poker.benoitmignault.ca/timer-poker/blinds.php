<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Récupération et validation de l'ID de l'organisateur depuis les paramètres GET
$organizerId = filter_var($_GET["id"] ?? null, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

// Vérification si l'ID de l'organisateur est valide
if ($organizerId === false) {

    error_log("ID de l'organisateur invalide: " . $organizerId);
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID de l'organisateur invalide."]);
    exit;
}

// Récupération et validation du niveau depuis les paramètres GET
$level = filter_var($_GET["level"] ?? null, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

// Vérification si le niveau est valide
if ($level === false) {

    error_log("Niveau invalide: " . $level);
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Niveau invalide."]);
    exit;
}

// Établier la connexion à la base de données pour les soirées de poker
$connMYSQL = connexionOrganizersDB();