

function BlindPanel({ organizer, blinds, onBlindChanged }) {
	const changeBlind = () => {
		const nextLevel = blinds.level + 1;
		if (nextLevel > blinds.maxLevel) return;

		fetch(`${API_BASE_URL}/mises.php?user=${organizer}&niveau=${nextLevel}`)
			.then((r) => r.json())
			.then((data) => {
				onBlindChanged({
					smallBlind: data.valeurSmall,
					bigBlind: data.valeurBig,
					level: nextLevel,
					maxLevel: blinds.maxLevel,
				});
			});
	};
	// ...
}

export default BlindPanel;