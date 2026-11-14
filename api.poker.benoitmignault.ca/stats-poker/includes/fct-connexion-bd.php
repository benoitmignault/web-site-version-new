<?php
	/**
	 * Connexion à la base de données pour les statistiques des tournois de poker
	 *
	 * @return mysqli La connexion à la base de données
	 */
	function connexionStatsDB(): mysqli {		

		include_once(__DIR__ . "/info-connexion-bd.php");

		$connMYSQL = mysqli_connect(
			$host,
			$user,
			$password,
			$bd_stats
		);

		if (!$connMYSQL) {

			// Détail technique en log serveur seulement...
			error_log("Erreur de connexion à la base de données : " . mysqli_connect_error());

			http_response_code(500);
			echo json_encode(["success" => false, "code" => "errorDbConnection", "message" => "Erreur de connexion à la base de données."]);

			exit();
		}

		$connMYSQL->set_charset("utf8mb4");

		return $connMYSQL;
	}