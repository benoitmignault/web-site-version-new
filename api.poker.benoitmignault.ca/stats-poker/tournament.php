<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Valider le paramètre id_tournoi avant toute connexion à la base de données
// Le ?? permet de gérer le cas où le paramètre n'est pas fourni, en renvoyant null dans ce cas.
$idTournoi = filter_var($_GET["id_tournoi"] ?? null, FILTER_VALIDATE_INT);

// Si l'id est absent ou invalide, on arrête ici avec une erreur 400
if ($idTournoi === false) {

    error_log("ID tournoi invalide: " . var_export($_GET["id_tournoi"] ?? null, true));    
	http_response_code(400);
	echo json_encode(["success" => false, "code" => "invalidTournamentId", "message" => "Le paramètre 'id_tournoi' est absent ou invalide"]);
	exit();
}

// Établir la connexion à la base de données pour les statistiques de poker
$connMYSQL = connexionStatsDB();

// --- Le tournoi existe-t-il ? ---
// (une date par tournoi : la requête ramène la date si le tournoi existe)
$select = "SELECT DISTINCT date ";
$from = "FROM poker ";
$where = "WHERE id_tournoi = ?";
$sqlTournoi = $select . $from . $where;
$stmtTournoi = $connMYSQL->prepare($sqlTournoi);

// Vérification si la préparation de la requête a réussi
if ($stmtTournoi === false) {

    error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
    http_response_code(500);
    echo json_encode(["success" => false, "code" => "errorPrepareQuery", "message" => "Erreur lors de la préparation de la requête."]);
    $connMYSQL->close();
    exit;
}

$stmtTournoi->bind_param("i", $idTournoi);

// Vérifier si la requête a réussi
if (!$stmtTournoi->execute()) {

    error_log("Erreur lors de l'exécution de la requête: " . $stmtTournoi->error);
    http_response_code(500);
    echo json_encode(["success" => false, "code" => "errorExecuteQuery", "message" => "Erreur lors de l'exécution de la requête."]); 
    
    // Fermer la connexion au résultat du insert dans la base de données et la connexion à la base de données
    $stmtTournoi->close();
    $connMYSQL->close();
    exit();
}

// Récupérer le résultat de la requête pour le tournoi en créant une nouvelle variable
$resultTournoi = $stmtTournoi->get_result();
$tournoi = $resultTournoi->fetch_assoc();
$stmtTournoi->close();

// Vérifier si le tournoi existe, sinon on arrête ici avec une erreur 404
if ($tournoi === null) {

    error_log("Aucun tournoi trouvé pour l'ID: " . $idTournoi);
	http_response_code(404);
	echo json_encode(["success" => false, "code" => "tournamentNotFound", "message" => "Aucun tournoi ne correspond à cet identifiant."]);

	// Fermer la connexion à la base de données
	$connMYSQL->close();
	exit();
}

// --- Les participants du tournoi ---
// Même logique de tri que la vue Tout afficher, à l'intérieur d'un tournoi :
// par gain décroissant, les killers départagent les égalités, le prix citron ferme sa classe de gain, puis par nom de joueur
$select = "SELECT p.id, j.joueur AS nom, p.gain, p.victoire, p.fini_2e, p.killer, p.prix_citron ";
$from = "FROM poker p INNER JOIN joueur j ON j.id = p.id_joueur ";
$where = "WHERE p.id_tournoi = ? ";
$orderBy = "ORDER BY p.gain DESC, p.killer DESC, (p.prix_citron > 0) ASC, j.joueur ASC";
$sqlParticipants = $select . $from . $where . $orderBy;

$stmtParticipants = $connMYSQL->prepare($sqlParticipants);

// Vérification si la préparation de la requête a réussi
if ($stmtParticipants === false) {

	error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorPrepareQuery", "message" => "Une erreur est survenue lors de la préparation de la requête."]);
	
    // Fermer les connexions à la base de données
    $connMYSQL->close();
	exit();
}

// Lier le paramètre id_tournoi à la requête et l'exécuter
$stmtParticipants->bind_param("i", $idTournoi);

// Vérifier si la requête a réussi
if (!$stmtParticipants->execute()) {

	error_log("Erreur lors de l'exécution de la requête: " . $stmtParticipants->error);
	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorExecuteQuery", "message" => "Erreur lors de l'exécution de la requête."]);
	
    // Fermer les connexions à la base de données
    $stmtParticipants->close();
	$connMYSQL->close();
	exit();
}

$resultParticipants = $stmtParticipants->get_result();

// Créer un tableau pour stocker les participants
$players = [];

// Parcourir les résultats de la requête et ajouter chaque participant au tableau
while ($row = $resultParticipants->fetch_assoc()) {

	// Ajouter chaque participant au tableau (types normalisés pour le JavaScript)
	$players[] = [
		"id" => (int) $row["id"],
		"nom" => $row["nom"],
		"gain" => (int) $row["gain"],
		"victoire" => (int) $row["victoire"],
		"fini2e" => (int) $row["fini_2e"],
		"killer" => (float) $row["killer"],
		"prixCitron" => (float) $row["prix_citron"]
	];
}

// Fermer la requête préparée des participants
$stmtParticipants->close();

http_response_code(200);

// Retourner les données au format JSON :
// le tournoi et ses participants dans une seule réponse
echo json_encode([
	"success" => true,
	"tournament" => [
		"id" => $idTournoi,
		"date" => $tournoi["date"],
		"players" => $players
	]
]);

// Fermer la connexion à la base de données
$connMYSQL->close();