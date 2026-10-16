import { t } from "../i18n/i18n";

function ChipList({ couleurs }) {

	// Tri par valeur croissante pour un affichage logique
	const jetons = [...couleurs].sort((a, b) => a.amount - b.amount);

	if (jetons.length === 0) {
		return <p>{t('erreurSansJetons')}</p>;
	}

	return (
		<section>
			<h2>{t('valeursJetons')}</h2>
			<ul>
				{jetons.map((jeton) => (
					<li key={jeton.id_couleur ?? jeton.amount}>
                        <span className={`jeton ${jeton.color_english}`}>{jeton.amount}</span>
                        <span>{t(`couleur_${jeton.color_english}`)}</span>
                    </li>
				))}
			</ul>
		</section>
	);
}

export default ChipList;
