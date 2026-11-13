<?php

// Inclut les informations nécessaires pour CORS
include(__DIR__ . "/includes/cors.php");

// Inclut la fonction de connexion à la base de données
include(__DIR__ . "/includes/fct-connexion-bd.php");

// Récupérer le paramètre min_presences et valider que c'est un entier
$minPresences = filter_var($_GET["min_presences"] ?? null, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);

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
// Le tri par défaut est celui de la version 1 (le + killer, le - prix citron, le - présences) ;
// le tri interactif par colonne se fait côté React.
$select = "SELECT j.id, j.joueur AS nom, COUNT(*) AS presences, SUM(p.killer) AS killers, SUM(p.prix_citron) AS citrons, 
                  ROUND(SUM(p.killer) / COUNT(*), 2) AS killer_par_presence, ROUND(SUM(p.prix_citron) / COUNT(*), 2) AS citron_par_presence ";
$from = "FROM poker p INNER JOIN joueur j ON j.id = p.id_joueur ";
$where = "WHERE p.id_tournoi > 100 "; // Exclure les 100 premiers tournois qui n'avaient pas la notion de killer & de prix citron
$groupBy = "GROUP BY j.id, j.joueur ";
$having = "HAVING COUNT(*) >= ? ";
$orderBy = "ORDER BY killers DESC, citrons, presences ASC";
$sql = $select . $from . $where . $groupBy . $having . $orderBy;

$stmtKillersLemons = $connMYSQL->prepare($sql);

// Vérification si la préparation de la requête a réussi
if ($stmtKillersLemons === false) {

	error_log("Erreur lors de la préparation de la requête: " . $connMYSQL->error);
	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorPrepareQuery", "message" => "Une erreur est survenue lors de la préparation de la requête."]);
	$connMYSQL->close();
	exit();
}

// Lier le paramètre min_presences à la requête
$stmtKillersLemons->bind_param("i", $minPresences);

// Vérifier si l'exécution de la requête a réussi
if (!$stmtKillersLemons->execute()) {

	error_log("Erreur lors de l'exécution de la requête: " . $stmtKillersLemons->error);
	http_response_code(500);
	echo json_encode(["success" => false, "code" => "errorExecuteQuery", "message" => "Une erreur est survenue lors de l'exécution de la requête."]);
	$stmtKillersLemons->close();
	$connMYSQL->close();
	exit();
}

// Récupérer les résultats de la requête
$resultKillersLemons = $stmtKillersLemons->get_result();

// Créer un tableau pour stocker les lignes du classement
$killersLemons = [];

// Parcourir les résultats de la requête et ajouter chaque joueur au tableau
while ($row = $resultKillersLemons->fetch_assoc()) {

    // Ajouter chaque joueur au tableau (types normalisés pour le JavaScript)
	$killersLemons[] = [
		"id" => (int) $row["id"],
		"nom" => $row["nom"],
		"presences" => (int) $row["presences"],
		"killers" => (int) $row["killers"],
		"citrons" => (int) $row["citrons"],
		"killerParPresence" => (float) $row["killer_par_presence"]
	];
}

// Fermer la requête préparée
$stmtKillersLemons->close();

http_response_code(200);

// Retourner les données au format JSON :
echo json_encode(["success" => true, "killersLemons" => $killersLemons]);

// Fermer la connexion à la base de données
$connMYSQL->close();
