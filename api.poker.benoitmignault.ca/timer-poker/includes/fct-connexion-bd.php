<?php
	/**
	 * Fonction de connexion à la base de données des organisateurs de poker.
	 *
	 * @return mysqli La connexion à la base de données
	 */
	function connexionOrganizersDB(): mysqli {		

		include_once(__DIR__ . "/info-connexion-bd.php");

		$connMYSQL = mysqli_connect(
			$host,
			$user,
			$password,
			$bd_organizers
		);		

		if ($connMYSQL === false) {

			// Détail technique en log serveur seulement...
			error_log("Échec connexion BD organisateurs : " . mysqli_connect_error());
			
			// ...message générique pour le client, dans notre enveloppe JSON
			die(json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]));
		}

		$connMYSQL->set_charset("utf8mb4");

		return $connMYSQL;
	}