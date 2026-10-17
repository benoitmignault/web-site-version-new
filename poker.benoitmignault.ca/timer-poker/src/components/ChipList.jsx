import { useEffect, useState } from "react";
import { t } from "../i18n/i18n";

function ChipList({ organizerId }) {
	
	const [chips, setChips] = useState([]);

	useEffect(() => {
		if (!organizerId) return;

		fetch(`${API_BASE_URL}/chips.php?id=${organizerId}`)
			.then((r) => r.json())
			.then((data) => setChips(data));
	}, [organizerId]);

	const sortedChips = [...chips].sort((a, b) => a.amount - b.amount);

	return (
		<section>
			<ul>
				{sortedChips.map((chip) => (
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
