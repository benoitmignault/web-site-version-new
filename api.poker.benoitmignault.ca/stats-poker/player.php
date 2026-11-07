<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Valider le paramètre id_joueur avant toute connexion à la base de données
$idJoueur = filter_var($_GET["id_joueur"] ?? null, FILTER_VALIDATE_INT);

// Si l'id est absent ou invalide, on arrête ici avec une erreur 400
if ($idJoueur === false) {

    error_log("ID joueur invalide: " . var_export($_GET["id_joueur"] ?? null, true));    
	http_response_code(400);
	echo json_encode(["success" => false, "code" => "invalidPlayerId", "message" => "Le paramètre 'id_joueur' est absent ou invalide"]);
	exit();
}

// Établir la connexion à la base de données pour les statistiques de poker
$connMYSQL = connexionStatsDB();

// --- Le joueur existe-t-il ? ---
// (la colonne du nom s'appelle "joueur" dans la table, on l'expose en "nom")
$sqlJoueur = "SELECT id, joueur AS nom FROM joueur WHERE id = ?";
$stmtJoueur = $connMYSQL->prepare($sqlJoueur);

// Vérification si la préparation de la requête a réussi
if ($stmtJoueur === false) {

    error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
    http_response_code(500);
    echo json_encode(["success" => false, "code" => "errorPrepareQuery", "message" => "Erreur lors de la préparation de la requête."]);
    $connMYSQL->close();
    exit;
}

$stmtJoueur->bind_param("i", $idJoueur);

// Vérifier si la requête a réussi
if (!$stmtJoueur->execute()) {

    error_log("Erreur lors de l'exécution de la requête: " . $stmtJoueur->error);
    http_response_code(500);
    echo json_encode(["success" => false, "code" => "errorExecuteQuery", "message" => "Erreur lors de l'exécution de la requête."]); 
    
    // Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
    $stmtJoueur->close();
    $connMYSQL->close();
    exit();
}

$resultatJoueur = $stmtJoueur->get_result();
$joueur = $resultatJoueur->fetch_assoc();
$stmtJoueur->close();

// Si aucun joueur ne porte cet id, on arrête ici avec une erreur 404
if (!$joueur) {

    error_log("Aucun joueur trouvé pour l'ID: " . $idJoueur);
	http_response_code(404);
	echo json_encode(["success" => false, "code" => "playerNotFound", "message" => "Aucun joueur ne correspond à cet identifiant."]);

	// Fermer la connexion à la base de données
	$connMYSQL->close();
	exit();
}

// --- Sommaire du joueur (méthode 3) : tous les agrégats sont calculés par SQL ---
$select = "SELECT COUNT(*) AS presences, ";
$select .= "COALESCE(SUM(gain), 0) AS gain_net, ";
$select .= "COALESCE(SUM(victoire), 0) AS victoires, ";
$select .= "COALESCE(SUM(fini_2e), 0) AS deuxiemes, ";
$select .= "COALESCE(SUM(killer), 0) AS killers, ";
$select .= "COALESCE(SUM(prix_citron), 0) AS prix_citrons ";
$from = "FROM poker ";
$where = "WHERE id_joueur = ?";
$sqlSommaire = $select . $from . $where;

$stmtSommaire = $connMYSQL->prepare($sqlSommaire);

// Vérification si la préparation de la requête a réussi
if ($stmtSommaire === false) {

    error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
    http_response_code(500);
    echo json_encode(["success" => false, "code" => "errorPrepareQuery", "message" => "Erreur lors de la préparation de la requête."]);
    $connMYSQL->close();
    exit;
}

$stmtSommaire->bind_param("i", $idJoueur);

// Vérifier si la requête a réussi
if (!$stmtSommaire->execute()) {

    error_log("Erreur lors de l'exécution de la requête: " . $stmtSommaire->error);
    http_response_code(500);
    echo json_encode(["success" => false, "code" => "errorExecuteQuery", "message" => "Erreur lors de l'exécution de la requête."]); 
    
    // Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
    $stmtSommaire->close();
    $connMYSQL->close();
    exit();
}

$resultatSommaire = $stmtSommaire->get_result();
$ligneSommaire = $resultatSommaire->fetch_assoc();
$stmtSommaire->close();

// Assembler le sommaire avec les bons types pour le JavaScript
$summary = [
	"presences" => (int)$ligneSommaire["presences"],
	"gainNet" => (int)$ligneSommaire["gain_net"],
	"victoires" => (int)$ligneSommaire["victoires"],
	"deuxiemes" => (int)$ligneSommaire["deuxiemes"],
	"killers" => (float)$ligneSommaire["killers"],
	"prixCitrons" => (float)$ligneSommaire["prix_citrons"]
];

// --- Historique des visites du joueur (méthode 2), de la plus récente à la plus ancienne ---
$select = "SELECT id_tournoi, date, gain, victoire, fini_2e, killer, prix_citron ";
$from = "FROM poker ";
$where = "WHERE id_joueur = ? ";
$orderBy = "ORDER BY date DESC, id_tournoi DESC";
$sqlHistorique = $select . $from . $where . $orderBy;

$stmtHistorique = $connMYSQL->prepare($sqlHistorique);

// Vérification si la préparation de la requête a réussi
if ($stmtHistorique === false) {

    error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
    http_response_code(500);
    echo json_encode(["success" => false, "code" => "errorPrepareQuery", "message" => "Erreur lors de la préparation de la requête."]);
    $connMYSQL->close();
    exit;
}

$stmtHistorique->bind_param("i", $idJoueur);

// Vérifier si la requête a réussi
if (!$stmtHistorique->execute()) {

    error_log("Erreur lors de l'exécution de la requête: " . $stmtHistorique->error);
    http_response_code(500);
    echo json_encode(["success" => false, "code" => "errorExecuteQuery", "message" => "Erreur lors de l'exécution de la requête."]); 
    
    // Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
    $stmtHistorique->close();
    $connMYSQL->close();
    exit();
}

$resultatHistorique = $stmtHistorique->get_result();

// Créer un tableau pour stocker les visites
$history = [];

// Parcourir les résultats de la requête et ajouter chaque visite au tableau
while ($row = $resultatHistorique->fetch_assoc()) {

	$history[] = [
		"idTournoi" => (int)$row["id_tournoi"],
		"date" => $row["date"],
		"gain" => (int)$row["gain"],
		"victoire" => (int)$row["victoire"],
		"fini2e" => (int)$row["fini_2e"],
		"killer" => (float)$row["killer"],
		"prixCitron" => (float)$row["prix_citron"]
	];
}
$stmtHistorique->close();

http_response_code(200);

// Retourner le joueur, son sommaire et son historique en une seule réponse
echo json_encode([
	"success" => true,
	"player" => [
		"id" => (int)$joueur["id"],
		"nom" => $joueur["nom"],
		"summary" => $summary,
		"history" => $history
	]
]);

// Fermer la connexion à la base de données
$connMYSQL->close();
