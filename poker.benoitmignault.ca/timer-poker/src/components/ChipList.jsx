import { t } from "../i18n/i18n";

function ChipList({ chips }) {

	// Tri par valeur croissante pour un affichage logique
	const chips = [...chips].sort((a, b) => a.amount - b.amount);

	if (chips.length === 0) {
		return <p>{t('erreurSansJetons')}</p>;
	}

	return (
		<section>
			<h2>{t('valeursJetons')}</h2>
			<ul>
				{chips.map((chip) => (
					<li key={chip.id_couleur ?? chip.amount}>
                        <span className={`chip ${chip.color_english}`}>{chip.amount}</span>
                        <span>{t(`color_${chip.color_english}`)}</span>
                    </li>
				))}
			</ul>
		</section>
	);
}

export default ChipList;
