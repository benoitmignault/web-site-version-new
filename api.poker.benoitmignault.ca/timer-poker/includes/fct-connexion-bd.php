<?php
	/**
	 * Connexion à la BD des organisateurs de tournois de poker.
	 * 
	 * @return mysqli
	 */
	function connexionOrganizersDB(): mysqli {		

		include_once(__DIR__ . "/info-connexion-bd.php");

		$connMYSQL = mysqli_connect(
			$host,
			$user,
			$password,
			$bd_organizers
		);

		if ($connMYSQL->connect_error) {
			// Même enveloppe que l'API : ton React teste data.success
			die(json_encode(["success" => false, "message" => $connMYSQL->connect_error]));
		}

		$connMYSQL->set_charset("utf8mb4");

		return $connMYSQL;
	}