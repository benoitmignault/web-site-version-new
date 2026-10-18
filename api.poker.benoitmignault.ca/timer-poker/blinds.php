<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Récupération et validation de l'ID de l'organisateur depuis les paramètres GET
$organizerId = filter_var($_GET["id"] ?? null, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

// Vérification si l'ID de l'organisateur est valide
if ($organizerId === false) {

    error_log("ID de l'organisateur invalide: " . var_export($_GET["id"] ?? null, true));
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

// Récupération du niveau maximum pour cet organisateur pour vérifier si ils possèdent des combinaisons et sera utilisé si nous sommes arrivÉ à la fin des combinaisons de niveaux pour cet organisateur
$sqlMax = "SELECT MAX(level) AS max_level FROM mise_small_big WHERE id_user = ?";
$stmtMax = $connMYSQL->prepare($sqlMax);

// Vérification si la préparation de la requête a réussi
if ($stmtMax === false) {

    error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la préparation de la requête."]);
    $connMYSQL->close();
    exit;
}

$stmtMax->bind_param("i", $organizerId);

// Vérifier si la requête a réussi
if (!$stmtMax->execute()) {

    error_log($stmtMax->error);
    
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'exécution de la requête."]); 
    
    // Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
    $stmtMax->close();
    $connMYSQL->close();
    exit();
}

// Récupérer le niveau maximum pour cet organisateur
$maxLevel = $stmtMax->get_result()->fetch_assoc()["max_level"];
$stmtMax->close();

// Aucun niveau de mise pour cet organisateur
if ($maxLevel === null) {

    error_log("Aucune combinaison de blinds trouvée pour l'organisateur avec l'ID: " . $organizerId);
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Aucune combinaison de blinds trouvée pour l'organisateur."]);
    $connMYSQL->close();
    exit;
}

$maxLevel = (int)$maxLevel;

// Niveau borné au maximum
$level = min($level, $maxLevel);

// Les mises du niveau demandé
$sql = "SELECT small, big FROM mise_small_big WHERE id_user = ? AND level = ?";
$stmt = $connMYSQL->prepare($sql);

if ($stmt === false) {
    
    error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de la préparation de la requête."]);
    $connMYSQL->close();
    exit;
}

$stmt->bind_param("ii", $organizerId, $level);

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

// Récupérer les blinds pour le niveau demandé
$result = $stmt->get_result();

// Il n'est pas nécessaire de vérifier si le résultat est vide, 
// car nous avons déjà vérifié que le niveau demandé est inférieur ou égal au niveau maximum pour cet organisateur. 
// Il est donc garanti qu'il y aura un résultat.
$blind = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "maxLevel" => $maxLevel,
    "small" => (int)$blind["small"],
    "big" => (int)$blind["big"]
]);

$stmt->close();
$connMYSQL->close();
