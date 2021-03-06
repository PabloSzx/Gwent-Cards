import _ from 'lodash';
import emotes from './emotes.json';

const translation = {
	'de-DE': {
		group: 'Gruppe',
		_group: {
			Leader: 'Anführer',
			Gold: 'Gold',
			Silver: 'Silber',
			Bronze: 'Bronze'
		},
		rarity: 'Seltenheit',
		_rarity: {
			Legendary: 'Legendär',
			Epic: 'Episch',
			Rare: 'Selten',
			Common: 'Gewöhnlich'
		},
		faction: 'Fraktion',
		_faction: {
			Neutral: 'Neutral',
			Monster: 'Monster',
			Scoiatael: "Scoia'Tael",
			NorthernKingdom: 'Nördliche Königreiche',
			Skellige: 'Skellige',
			Nilfgaard: 'Nilfgaard'
		},
		power: 'Kraft',
		type: 'Art',
		_type: {
			Special: 'Sonderkarte',
			Dwarf: 'Zwerg',
			Elf: 'Elf',
			Witcher: 'Hexer',
			Mage: 'Magier',
			Ambush: 'Überfall',
			Dryad: 'Dryade',
			Breedable: 'Zucht Möglich',
			Weather: 'Wettereffekt',
			'Wild Hunt': 'Wilde Jagd',
			Vampire: 'Vampir',
			Dragon: 'Drache',
			Shapeshifter: 'Doppler',
			'Blue Stripes': 'Blaue Streifen'
		},
		lane: 'Position',
		_lane: {
			Event: 'Ereignis',
			Melee: 'Nahkampf',
			Ranged: 'Fernkampf',
			Siege: 'Belagerung',
			Any: 'Gewandtheit'
		},
		loyalty: 'Loyalität: ',
		_loyalty: {
			Loyal: 'Loyal',
			Disloyal: 'Illoyal'
		},
		mill: 'Mahlen',
		craft: 'Herstellen'
	},
	'en-US': {
		group: 'Group',
		_group: {
			Leader: 'Leader',
			Gold: 'Gold',
			Silver: 'Silver',
			Bronze: 'Bronze'
		},
		rarity: 'Rarity',
		_rarity: {
			Legendary: 'Legendary',
			Epic: 'Epic',
			Rare: 'Rare',
			Common: 'Common'
		},
		faction: 'Faction',
		_faction: {
			Neutral: 'Neutral',
			Monster: 'Monster',
			Scoiatael: "Scoia'tael",
			NorthernKingdom: 'Northern Realms',
			Skellige: 'Skellige',
			Nilfgaard: 'Nilfgaard'
		},
		power: 'Power',
		type: 'Type',
		_type: {
			Special: 'Special',
			Dwarf: 'Dwarf',
			Elf: 'Elf',
			Witcher: 'Witcher',
			Mage: 'Mage',
			Ambush: 'Ambush',
			Dryad: 'Dryad',
			Breedable: 'Breedable',
			Weather: 'Weather',
			'Wild Hunt': 'Wild Hunt',
			Vampire: 'Vampire',
			Dragon: 'Dragon',
			Shapeshifter: 'Shapeshifter',
			'Blue Stripes': 'Blue Stripes'
		},
		lane: 'Lane',
		_lane: {
			Event: 'Event',
			Melee: 'Melee',
			Ranged: 'Ranged',
			Siege: 'Siege',
			Any: 'Any'
		},
		loyalty: 'Loyalty',
		_loyalty: {
			Loyal: 'Loyal',
			Disloyal: 'Disloyal'
		},
		mill: 'Mill',
		craft: 'Craft'
	},
	'es-ES': {
		group: 'Grupo',
		_group: {
			Leader: 'Líder',
			Gold: 'Oro',
			Silver: 'Plata',
			Bronze: 'Bronce'
		},
		rarity: 'Rareza',
		_rarity: {
			Legendary: 'Legendaria',
			Epic: 'Épica',
			Rare: 'Rara',
			Common: 'Común'
		},
		faction: 'Facción',
		_faction: {
			Neutral: 'Neutral',
			Monster: 'Monstruos',
			Scoiatael: "Scoia'Tael",
			NorthernKingdom: 'Reinos Del Norte',
			Skellige: 'Skellige',
			Nilfgaard: 'Nilfgaard'
		},
		power: 'Fuerza',
		type: 'Tipo',
		_type: {
			Special: 'Especial',
			Dwarf: 'Enano',
			Elf: 'Elfo',
			Witcher: 'Brujo',
			Mage: 'Hechicería',
			Ambush: 'Emboscada',
			Dryad: 'Dríade',
			Breedable: 'Engendrados',
			Weather: 'Clima',
			'Wild Hunt': 'Cacería Salvaje',
			Vampire: 'Vampiro',
			Dragon: 'Dragón',
			Shapeshifter: 'Cambiaformas',
			'Blue Stripes': 'Franjas Azules'
		},
		lane: 'Posición',
		_lane: {
			Event: 'Acontecimiento',
			Melee: 'Cuerpo A Cuerpo',
			Ranged: 'A Distancia',
			Siege: 'Asedio',
			Any: 'Ágil'
		},
		loyalty: 'Lealtad',
		_loyalty: {
			Loyal: 'Leal',
			Disloyal: 'Desleal'
		},
		mill: 'Moler',
		craft: 'Crear'
	},
	'es-MX': {
		group: 'Grupo',
		_group: {
			Leader: 'Líder',
			Gold: 'Oro',
			Silver: 'Plata',
			Bronze: 'Bronce'
		},
		rarity: 'Rareza',
		_rarity: {
			Legendary: 'Legendaria',
			Epic: 'Épica',
			Rare: 'Rara',
			Common: 'Común'
		},
		faction: 'Facción',
		_faction: {
			Neutral: 'Neutral',
			Monster: 'Monstruos',
			Scoiatael: "Scoia'Tael",
			NorthernKingdom: 'Reinos Del Norte',
			Skellige: 'Skellige',
			Nilfgaard: 'Nilfgaard'
		},
		power: 'Poder',
		type: 'Tipo',
		_type: {
			Special: 'Especial',
			Dwarf: 'Enano',
			Elf: 'Elfo',
			Witcher: 'Brujo',
			Mage: 'Mago',
			Ambush: 'Emboscada',
			Dryad: 'Dríada',
			Breedable: 'Enjambre',
			Weather: 'Clima',
			'Wild Hunt': 'Cacería Salvaje',
			Vampire: 'Vampiro',
			Dragon: 'Dragón',
			Shapeshifter: 'Cambiaformas',
			'Blue Stripes': 'Franjas Azules'
		},
		lane: 'Posición',
		_lane: {
			Event: 'Evento',
			Melee: 'Melé',
			Ranged: 'Distancia',
			Siege: 'Asedio',
			Any: 'Ágil'
		},
		loyalty: 'Lealtad',
		_loyalty: {
			Loyal: 'Leal',
			Disloyal: 'Desleal'
		},
		mill: 'Moler',
		craft: 'Crear'
	},
	'fr-FR': {
		group: 'Groupe ',
		_group: {
			Leader: 'Chef',
			Gold: 'Or',
			Silver: 'Argent',
			Bronze: 'Bronze'
		},
		rarity: 'Rareté',
		_rarity: {
			Legendary: 'Légendaire',
			Epic: 'Épique',
			Rare: 'Rare',
			Common: 'Ordinaire'
		},
		faction: 'Faction',
		_faction: {
			Neutral: 'Neutre',
			Monster: 'Monstres',
			Scoiatael: "Scoia'Tael",
			NorthernKingdom: 'Royaumes Du Nord',
			Skellige: 'Skellige',
			Nilfgaard: 'Nilfgaard'
		},
		power: 'Force',
		type: 'Type',
		_type: {
			Special: 'Spéciale',
			Dwarf: 'Nain',
			Elf: 'Elfe',
			Witcher: 'Sorceleur',
			Mage: 'Mage',
			Ambush: 'Embuscade',
			Dryad: 'Dryade',
			Breedable: 'Reproductible',
			Weather: 'Météo',
			'Wild Hunt': 'Chasse Sauvage',
			Vampire: 'Vampire',
			Dragon: 'Dragon',
			Shapeshifter: 'Doppler',
			'Blue Stripes': 'Stries Bleues'
		},
		lane: 'Position',
		_lane: {
			Event: 'Événement',
			Melee: 'Combat Rapproché',
			Ranged: 'Combat À Distance',
			Siege: 'Combat De Siège',
			Any: 'Agile'
		},
		loyalty: 'Loyauté : ',
		_loyalty: {
			Loyal: 'Loyale',
			Disloyal: 'Déloyale'
		},
		mill: 'Fragmenter',
		craft: 'Fabriquer'
	},
	'it-IT': {
		group: 'Gruppo',
		_group: {
			Leader: 'Comandante',
			Gold: 'Oro',
			Silver: 'Argento',
			Bronze: 'Bronzo'
		},
		rarity: 'Rarità',
		_rarity: {
			Legendary: 'Leggendarie',
			Epic: 'Epiche',
			Rare: 'Rare',
			Common: 'Comuni'
		},
		faction: 'Fazione',
		_faction: {
			Neutral: 'Neutrali',
			Monster: 'Mostri',
			Scoiatael: "Scoia'Tael",
			NorthernKingdom: 'Regni Settentrionali',
			Skellige: 'Skellige',
			Nilfgaard: 'Nilfgaard'
		},
		power: 'Potenza',
		type: 'Tipo',
		_type: {
			Special: 'Speciale',
			Dwarf: 'Nano',
			Elf: 'Elfo',
			Witcher: 'Witcher',
			Mage: 'Mago',
			Ambush: 'Imboscata',
			Dryad: 'Driade',
			Breedable: 'Moltiplicabile',
			Weather: 'Clima',
			'Wild Hunt': 'Caccia Selvaggia',
			Vampire: 'Vampiro',
			Dragon: 'Drago',
			Shapeshifter: 'Mutaforma',
			'Blue Stripes': 'Bande Blu'
		},
		lane: 'Posizione',
		_lane: {
			Event: 'Evento',
			Melee: 'Corpo A Corpo',
			Ranged: 'A Distanza',
			Siege: 'Assedio',
			Any: 'Agili'
		},
		loyalty: 'Lealtà: ',
		_loyalty: {
			Loyal: 'Leali',
			Disloyal: 'Sleali'
		},
		mill: 'Ricicla',
		craft: 'Crea'
	},
	'ja-JP': {
		group: 'グループ',
		_group: {
			Leader: 'リーダー',
			Gold: 'ゴールド',
			Silver: 'シルバー',
			Bronze: 'ブロンズ'
		},
		rarity: 'レア度',
		_rarity: {
			Legendary: 'レジェンダリー',
			Epic: 'エピック',
			Rare: 'レア',
			Common: 'コモン'
		},
		faction: '勢力',
		_faction: {
			Neutral: 'ニュートラル',
			Monster: 'モンスター',
			Scoiatael: 'スコイア＝テル',
			NorthernKingdom: '北方諸国',
			Skellige: 'スケリッジ',
			Nilfgaard: 'ニルフガード'
		},
		power: '戦力',
		type: 'タイプ',
		_type: {
			Special: 'スペシャル',
			Dwarf: 'ドワーフ',
			Elf: 'エルフ',
			Witcher: 'ウィッチャー',
			Mage: '魔術師',
			Ambush: '奇襲',
			Dryad: 'ドリアード',
			Breedable: '増殖',
			Weather: '天候',
			'Wild Hunt': 'ワイルドハント',
			Vampire: '吸血鬼',
			Dragon: 'ドラゴン',
			Shapeshifter: '変身使い',
			'Blue Stripes': '刺青隊'
		},
		lane: '戦列',
		_lane: {
			Event: 'イベント',
			Melee: '近接',
			Ranged: '間接',
			Siege: '攻城',
			Any: '自由'
		},
		loyalty: '忠誠心：',
		_loyalty: {
			Loyal: '忠実',
			Disloyal: '不忠'
		},
		mill: '粉砕',
		craft: '生成'
	},
	'pl-PL': {
		group: 'Grupa',
		_group: {
			Leader: 'Karty Dowódców',
			Gold: 'Złote Karty',
			Silver: 'Srebrne Karty',
			Bronze: 'Brązowe Karty'
		},
		rarity: 'Rzadkość',
		_rarity: {
			Legendary: 'Legendarne',
			Epic: 'Epickie',
			Rare: 'Rzadkie',
			Common: 'Zwykłe'
		},
		faction: 'Frakcja',
		_faction: {
			Neutral: 'Neutralne',
			Monster: 'Potwory',
			Scoiatael: "Scoia'Tael",
			NorthernKingdom: 'Królestwa Północy',
			Skellige: 'Skellige',
			Nilfgaard: 'Nilfgaard'
		},
		power: 'Siła',
		type: 'Rodzaj',
		_type: {
			Special: 'Karta Specjalna',
			Dwarf: 'Krasnolud',
			Elf: 'Elf',
			Witcher: 'Wiedźmin',
			Mage: 'Czarodziej',
			Ambush: 'Zasadzka',
			Dryad: 'Driada',
			Breedable: 'Rój',
			Weather: 'Karta Pogody',
			'Wild Hunt': 'Dziki Gon',
			Vampire: 'Wampir',
			Dragon: 'Smok',
			Shapeshifter: 'Zmiennokształtny',
			'Blue Stripes': 'Niebieskie Pasy'
		},
		lane: 'Pozycja',
		_lane: {
			Event: 'Wydarzenie',
			Melee: 'Bliskie Starcie',
			Ranged: 'Daleki Zasięg',
			Siege: 'Oblężenie',
			Any: 'Zwinne'
		},
		loyalty: 'Lojalność: ',
		_loyalty: {
			Loyal: 'Lojalne',
			Disloyal: 'Nielojalne'
		},
		mill: 'Zniszcz',
		craft: 'Stwórz'
	},
	'pt-BR': {
		group: 'Grupo',
		_group: {
			Leader: 'Líder',
			Gold: 'Ouro',
			Silver: 'Prata',
			Bronze: 'Bronze'
		},
		rarity: 'Raridade',
		_rarity: {
			Legendary: 'Lendária',
			Epic: 'Épica',
			Rare: 'Rara',
			Common: 'Comum'
		},
		faction: 'Facção',
		_faction: {
			Neutral: 'Neutras',
			Monster: 'Monstros',
			Scoiatael: "Scoia'Tael",
			NorthernKingdom: 'Reinos Do Norte',
			Skellige: 'Skellige',
			Nilfgaard: 'Nilfgaard'
		},
		power: 'Poder',
		type: 'Tipo',
		_type: {
			Special: 'Especial',
			Dwarf: 'Anão',
			Elf: 'Elfo',
			Witcher: 'Bruxo',
			Mage: 'Mago',
			Ambush: 'Emboscada',
			Dryad: 'Dríade',
			Breedable: 'Procriável',
			Weather: 'Clima',
			'Wild Hunt': 'Caçada Selvagem',
			Vampire: 'Vampiro',
			Dragon: 'Dragão',
			Shapeshifter: 'Metamorfo',
			'Blue Stripes': 'Listras Azuis'
		},
		lane: 'Posição',
		_lane: {
			Event: 'Evento',
			Melee: 'Corpo A Corpo',
			Ranged: 'Longa Distância',
			Siege: 'Cerco',
			Any: 'Ágil'
		},
		loyalty: 'Lealdade: ',
		_loyalty: {
			Loyal: 'Leal',
			Disloyal: 'Desleal'
		},
		mill: 'Moer',
		craft: 'Criar'
	},
	'ru-RU': {
		group: 'Группа',
		_group: {
			Leader: 'Лидеры',
			Gold: 'Золотые',
			Silver: 'Серебряные',
			Bronze: 'Бронзовые'
		},
		rarity: 'Редкость',
		_rarity: {
			Legendary: 'Легендарные',
			Epic: 'Эпические',
			Rare: 'Редкие',
			Common: 'Обычные'
		},
		faction: 'Фракция',
		_faction: {
			Neutral: 'Нейтральные',
			Monster: 'Чудовища',
			Scoiatael: "Скоя'Таэли",
			NorthernKingdom: 'Королевства Севера',
			Skellige: 'Скеллиге',
			Nilfgaard: 'Нильфгаард'
		},
		power: 'По Силе',
		type: 'Тип',
		_type: {
			Special: 'Особая',
			Dwarf: 'Краснолюд',
			Elf: 'Эльф',
			Witcher: 'Ведьмак',
			Mage: 'Чародей',
			Ambush: 'Засада',
			Dryad: 'Дриада',
			Breedable: 'Множащаяся',
			Weather: 'Погода',
			'Wild Hunt': 'Дикая Охота',
			Vampire: 'Вампир',
			Dragon: 'Дракон',
			Shapeshifter: 'Оборотень',
			'Blue Stripes': 'Синие Полоски'
		},
		lane: 'Позиция',
		_lane: {
			Event: 'Событие',
			Melee: 'Рукопашный Ряд',
			Ranged: 'Дальнобойный Ряд',
			Siege: 'Осадный Ряд',
			Any: 'Подвижные'
		},
		loyalty: 'Верность: ',
		_loyalty: {
			Loyal: 'Верные',
			Disloyal: 'Вероломные'
		},
		mill: 'Перемолоть',
		craft: 'Создать'
	},
	'zh-CN': {
		group: '分组',
		_group: {
			Leader: '领袖牌',
			Gold: '金色牌',
			Silver: '银色牌',
			Bronze: '铜色牌'
		},
		rarity: '稀有度',
		_rarity: {
			Legendary: '传奇',
			Epic: '史诗',
			Rare: '稀有',
			Common: '普通'
		},
		faction: '阵营',
		_faction: {
			Neutral: '中立',
			Monster: '怪兽',
			Scoiatael: '松鼠党',
			NorthernKingdom: '北方领域',
			Skellige: '史凯利杰',
			Nilfgaard: '尼弗迦德'
		},
		power: '战力',
		type: '类型',
		_type: {
			Special: '特殊',
			Dwarf: '矮人',
			Elf: '精灵',
			Witcher: '猎魔人',
			Mage: '法师',
			Ambush: '伏击',
			Dryad: '树精',
			Breedable: '繁育',
			Weather: '天气',
			'Wild Hunt': '狂猎',
			Vampire: '吸血鬼',
			Dragon: '巨龙',
			Shapeshifter: '变身',
			'Blue Stripes': '蓝衣铁卫'
		},
		lane: '位置',
		_lane: {
			Event: '事件',
			Melee: '近战',
			Ranged: '远程',
			Siege: '攻城',
			Any: '敏捷'
		},
		loyalty: '立场：',
		_loyalty: {
			Loyal: '忠诚',
			Disloyal: '不忠'
		},
		mill: '分解',
		craft: '合成'
	},
	'zh-TW': {
		group: '組別',
		_group: {
			Leader: '領導牌',
			Gold: '金色牌',
			Silver: '銀色牌',
			Bronze: '銅色牌'
		},
		rarity: '稀有度',
		_rarity: {
			Legendary: '傳奇',
			Epic: '史詩',
			Rare: '稀有',
			Common: '一般'
		},
		faction: '陣營：',
		_faction: {
			Neutral: '中立',
			Monster: '怪物',
			Scoiatael: '松鼠黨',
			NorthernKingdom: '北方領域',
			Skellige: '史凱利傑',
			Nilfgaard: '尼弗迦德'
		},
		power: '力量',
		type: '類型',
		_type: {
			Special: '特殊',
			Dwarf: '矮人',
			Elf: '精靈',
			Witcher: '狩魔獵人',
			Mage: '法師',
			Ambush: '伏擊',
			Dryad: '樹精',
			Breedable: '繁育',
			Weather: '天氣',
			'Wild Hunt': '狂獵',
			Vampire: '吸血鬼',
			Dragon: '巨龍',
			Shapeshifter: '變身',
			'Blue Stripes': '藍衣鐵衛'
		},
		lane: '位置',
		_lane: {
			Event: '事件',
			Melee: '近戰',
			Ranged: '遠程',
			Siege: '攻城',
			Any: '敏捷'
		},
		loyalty: '立場：',
		_loyalty: {
			Loyal: '效忠',
			Disloyal: '不忠'
		},
		mill: '分解',
		craft: '合成'
	}
};
/*
_.forIn(translation, (value, key) => {
//   _.forIn(value._rarity, (v, k) => {
//     switch (k) {
//       case 'Legendary':
//         _.set(translation, key + '._rarity.' + k, v + emotes.legendary);
//         break;
//       case 'Epic':
//         _.set(translation, key + '._rarity.' + k, v + emotes.epic);
//         break;
//       case 'Rare':
//         _.set(translation, key + '._rarity.' + k, v + emotes.rare);
//         break;
//       case 'Common':
//         _.set(translation, key + '._rarity.' + k, v + emotes.common);
//         break;
//       default:
//       //EMPTY
//     }
//   });
//   _.forIn(value._faction, (v, k) => {
//     switch (k) {
//       case 'Neutral':
//         _.set(translation, key + '._faction.' + k, v + emotes.neutral);
//         break;
//       case 'Monster':
//         _.set(translation, key + '._faction.' + k, v + emotes.monster);
//         break;
//       case 'Scoiatael':
//         _.set(translation, key + '._faction.' + k, v + emotes.scoiatael);
//         break;
//       case 'NorthernKingdom':
//         _.set(translation, key + '._faction.' + k, v + emotes.northern);
//         break;
//       case 'Skellige':
//         _.set(translation, key + '._faction.' + k, v + emotes.skellige);
//         break;
//       case 'Nilfgaard':
//         _.set(translation, key + '._faction.' + k, v + emotes.nilfgaard);
//         break;
//       default:
//       //EMPTY
//     }
//   });
//   _.set(translation, key + '._type.' + '[\'Double Agent\']', 'Double Agent' + emotes.doubleagent);
//   _.set(translation, key + '._loyalty.Disloyal', translation[key]._loyalty.Disloyal + emotes.agent);
//
//   _.forIn(value._lane, (v, k) => {
//     switch (k) {
//       case 'Any':
//         _.set(translation, key + '._lane.' + k, v + emotes.agile);
//         break;
//       case 'Siege':
//         _.set(translation, key + '._lane.' + k, v + emotes.siege);
//         break;
//       case 'Melee':
//         _.set(translation, key + '._lane.' + k, v + emotes.melee);
//         break;
//       case 'Ranged':
//         _.set(translation, key + '._lane.' + k, v + emotes.ranged);
//         break;
//       default:
//       //EMPTY
//     }
//   });
// });
*/
export default translation;
