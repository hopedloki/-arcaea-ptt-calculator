/**
 * Arcaea歌曲常量数据
 * 包含所有歌曲的定数信息
 */

// 完整的歌曲数据
const songsData = [
  {
    name: 'Testify',
    artist: 'Neko Hacker',
    pst: 7.8,
    prs: 9.4,
    ftr: 10.9,
    byd: 12.0,
    etr: null
  },
  {
    name: 'Designant.',
    artist: 'USA',
    pst: 7.5,
    prs: 9.6,
    ftr: 10.9,
    byd: 11.9,
    etr: null
  },
  {
    name: 'Tempestissimo',
    artist: 'xi',
    pst: 7.0,
    prs: 9.5,
    ftr: 10.7,
    byd: 11.7,
    etr: null
  },
  {
    name: 'Arcana Eden',
    artist: 'BlackY',
    pst: 5.5,
    prs: 8.7,
    ftr: 10.5,
    byd: 11.6,
    etr: null
  },
  {
    name: 'Pentiment',
    artist: 'xi',
    pst: 7.0,
    prs: 8.7,
    ftr: 10.4,
    byd: 11.5,
    etr: null
  },
  {
    name: 'Aether Crest: Astral',
    artist: 'CAMeLIA',
    pst: 6.0,
    prs: 8.9,
    ftr: 10.6,
    byd: null,
    etr: 11.5
  },
  {
    name: 'Lament Rain',
    artist: 'Fractal Dreamers',
    pst: 6.5,
    prs: 8.8,
    ftr: 10.6,
    byd: 11.4,
    etr: null
  },
  {
    name: 'Abstruse Dilemma',
    artist: 'Camellia',
    pst: 5.5,
    prs: 8.9,
    ftr: 11.3,
    byd: null,
    etr: null
  },
  {
    name: 'Arghena',
    artist: 'Etnea',
    pst: 7.5,
    prs: 9.6,
    ftr: 11.3,
    byd: null,
    etr: null
  },
  {
    name: 'ALTER EGO',
    artist: 'M2U',
    pst: 6.5,
    prs: 9.2,
    ftr: 10.5,
    byd: null,
    etr: 11.3
  },
  {
    name: 'Extradimensional Cosmic Phenomenon',
    artist: 'NIWASHI',
    pst: 6.5,
    prs: 8.8,
    ftr: 10.6,
    byd: null,
    etr: 11.3
  },
  {
    name: 'Aegleseeker',
    artist: 'PUPA',
    pst: 5.5,
    prs: 9.1,
    ftr: 11.2,
    byd: null,
    etr: null
  },
  {
    name: 'Grievous Lady',
    artist: 'Laur',
    pst: 6.5,
    prs: 9.3,
    ftr: 11.1,
    byd: null,
    etr: null
  },
  {
    name: 'Fracture Ray',
    artist: 'xi',
    pst: 6.0,
    prs: 9.5,
    ftr: 11.1,
    byd: null,
    etr: null
  },
  {
    name: '#1f1e33',
    artist: 'xi',
    pst: 5.5,
    prs: 9.2,
    ftr: 11.1,
    byd: null,
    etr: null
  },
  {
    name: 'World Ender',
    artist: 'Camellia',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.0,
    byd: 11.1,
    etr: null
  },
  {
    name: 'SAIKYO STRONGER',
    artist: 't+pazolite',
    pst: 5.5,
    prs: 9.4,
    ftr: 11.0,
    byd: null,
    etr: null
  },
  {
    name: 'LAMIA',
    artist: 'xi',
    pst: 5.0,
    prs: 8.5,
    ftr: 11.0,
    byd: null,
    etr: null
  },
  {
    name: 'Undying Macula',
    artist: 'SOUNDWALKER',
    pst: 5.5,
    prs: 8.7,
    ftr: 10.1,
    byd: null,
    etr: 11.0
  },
  {
    name: 'Misdeed -la bonté de Dieu et l\'origine du mal-',
    artist: '66ron',
    pst: 5.5,
    prs: 8.5,
    ftr: 10.9,
    byd: null,
    etr: null
  },
  {
    name: 'Infinite Strife,',
    artist: 'Team Grimoire',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.9,
    byd: 10.9,
    etr: null
  },
  {
    name: 'TEmPTaTiON',
    artist: 't+pazolite',
    pst: 5.0,
    prs: 8.2,
    ftr: 10.9,
    byd: null,
    etr: null
  },
  {
    name: 'CHAOS',
    artist: 'xi',
    pst: 5.5,
    prs: 7.5,
    ftr: 10.9,
    byd: null,
    etr: null
  },
  {
    name: 'Vulcānus',
    artist: 'xi',
    pst: 5.5,
    prs: 8.5,
    ftr: 10.9,
    byd: null,
    etr: null
  },
  {
    name: 'And Revive The Melody',
    artist: 'anubasu-anubasu',
    pst: 5.5,
    prs: 8.5,
    ftr: 10.9,
    byd: null,
    etr: null
  },
  {
    name: 'Breach of Faith',
    artist: 'xi',
    pst: 5.5,
    prs: 8.4,
    ftr: 10.3,
    byd: 10.9,
    etr: null
  },
  {
    name: 'DA\'AT -The First Seeker of Souls-',
    artist: 'Laur',
    pst: 5.5,
    prs: 8.4,
    ftr: 10.9,
    byd: null,
    etr: null
  },
  {
    name: 'ViRTUS',
    artist: 'xi',
    pst: 5.5,
    prs: 8.6,
    ftr: 9.9,
    byd: null,
    etr: 10.9
  },
  {
    name: 'MEGALOVANIA (Camellia Remix)',
    artist: 'Camellia',
    pst: 5.5,
    prs: 8.4,
    ftr: 9.8,
    byd: null,
    etr: 10.9
  },
  {
    name: 'We\'re All Gonna Die',
    artist: 'xi',
    pst: 5.5,
    prs: 8.0,
    ftr: 10.1,
    byd: null,
    etr: 10.9
  },
  {
    name: 'Welcome, Queen of Fiction.',
    artist: 'xi',
    pst: 5.0,
    prs: 8.5,
    ftr: 10.1,
    byd: null,
    etr: 10.9
  },
  {
    name: 'Code: Oblivion',
    artist: 'xi',
    pst: 5.5,
    prs: 8.3,
    ftr: 9.9,
    byd: null,
    etr: 10.9
  },
  {
    name: 'Ringed Genesis',
    artist: 'ARForest',
    pst: 5.5,
    prs: 8.4,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'Dantalion',
    artist: 'Team Grimoire',
    pst: 5.0,
    prs: 8.2,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'BUCHiGiRE Berserker',
    artist: 'xi',
    pst: 5.0,
    prs: 8.6,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'ω4',
    artist: 'xi',
    pst: 3.5,
    prs: 7.8,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'Divine Light of Myriad',
    artist: 'A.SAKA',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'GENOCIDER',
    artist: 'xi',
    pst: 4.5,
    prs: 8.9,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'Stasis',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'PRIMITIVE LIGHTS',
    artist: 'xi',
    pst: 5.5,
    prs: 8.8,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'Spider\'s Thread',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: '͟͝͞Ⅱ́̕',
    artist: 'xi',
    pst: 5.0,
    prs: 8.9,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'TeraVolt',
    artist: 'xi',
    pst: 5.0,
    prs: 8.9,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'Meta-Mysteria',
    artist: 'xi',
    pst: 5.0,
    prs: 7.8,
    ftr: 10.8,
    byd: null,
    etr: null
  },
  {
    name: 'Distorted Fate',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.6,
    byd: null,
    etr: 10.8
  },
  {
    name: 'Désive',
    artist: 'xi',
    pst: 5.0,
    prs: 8.0,
    ftr: 9.9,
    byd: null,
    etr: 10.8
  },
  {
    name: 'Black MInD',
    artist: 'xi',
    pst: 5.0,
    prs: 8.0,
    ftr: 10.8,
    byd: null,
    etr: 10.8
  },
  {
    name: 'Nightmare',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: 10.8
  },
  {
    name: 'Lilly',
    artist: 'xi',
    pst: 5.0,
    prs: 8.4,
    ftr: 9.9,
    byd: null,
    etr: 10.8
  },
  {
    name: 'ANDORXOR',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: 10.8
  },
  {
    name: 'MARENYX',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.5,
    byd: null,
    etr: 10.8
  },
  {
    name: 'ouroboros -twin stroke of the end-',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.7,
    byd: null,
    etr: null
  },
  {
    name: 'Cyaegha',
    artist: 'xi',
    pst: 5.5,
    prs: 8.4,
    ftr: 10.7,
    byd: null,
    etr: null
  },
  {
    name: 'World Vanquisher',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 10.7,
    byd: null,
    etr: null
  },
  {
    name: 'AMAZING MIGHTYYYY!!!!',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.7,
    byd: null,
    etr: null
  },
  {
    name: 'REKKA RESONANCE',
    artist: 'xi',
    pst: 5.0,
    prs: 8.9,
    ftr: 10.7,
    byd: null,
    etr: null
  },
  {
    name: 'NULL APOPHENIA',
    artist: 'xi',
    pst: 4.5,
    prs: 8.8,
    ftr: 10.7,
    byd: null,
    etr: null
  },
  {
    name: 'KYOREN ROMANCE',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.7,
    byd: null,
    etr: null
  },
  {
    name: 'Inverted World',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.5,
    byd: null,
    etr: 10.7
  },
  {
    name: 'Don\'t Fight The Music',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.3,
    byd: null,
    etr: 10.7
  },
  {
    name: 'AlterGate',
    artist: 'xi',
    pst: 5.5,
    prs: 8.7,
    ftr: 10.7,
    byd: null,
    etr: null
  },
  {
    name: 'Xterfusion',
    artist: 'xi',
    pst: 4.5,
    prs: 8.3,
    ftr: 9.8,
    byd: null,
    etr: 10.7
  },
  {
    name: 'Axium Crisis',
    artist: 'xi',
    pst: 5.5,
    prs: 8.5,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'cyanine',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'corps-sans-organes',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'AttraqtiA',
    artist: 'xi',
    pst: 4.0,
    prs: 8.3,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Overwhelm',
    artist: 'xi',
    pst: 5.0,
    prs: 8.5,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Seclusion',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Live Fast Die Young',
    artist: 'xi',
    pst: 4.5,
    prs: 8.5,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Good bye, Merry-Go-Round.',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Crimson Throne',
    artist: 'xi',
    pst: 4.0,
    prs: 8.0,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Manic Jeer',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: '[X]',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'UNKNOWN LEVELS',
    artist: 'xi',
    pst: 4.0,
    prs: 8.1,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Back to Basics',
    artist: 'xi',
    pst: 5.0,
    prs: 8.7,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'MVURBD',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Dies irae',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 9.5,
    byd: null,
    etr: 10.6
  },
  {
    name: 'Astral Quantization',
    artist: 'xi',
    pst: 5.0,
    prs: 8.1,
    ftr: 10.6,
    byd: null,
    etr: null
  },
  {
    name: 'Singularity',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.5,
    byd: 10.4,
    etr: null
  },
  {
    name: 'Halcyon',
    artist: 'xi',
    pst: 5.5,
    prs: 8.2,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'GLORY：ROAD',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'GIMME DA BLOOD',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Sheriruth (Laur Remix)',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Lightning Screw',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Aurgelmir',
    artist: 'xi',
    pst: 4.5,
    prs: 8.5,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Chronicle',
    artist: 'xi',
    pst: 5.0,
    prs: 8.9,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Lucid Traveler',
    artist: 'xi',
    pst: 4.5,
    prs: 8.9,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Rise of World',
    artist: 'xi',
    pst: 4.5,
    prs: 8.1,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Ego Eimi',
    artist: 'xi',
    pst: 5.5,
    prs: 8.6,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'XTREME',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'eden',
    artist: 'xi',
    pst: 4.5,
    prs: 8.2,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Wish Upon a Snow',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Aleph-0',
    artist: 'xi',
    pst: 5.5,
    prs: 8.8,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Twilight Concerto',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.5,
    byd: null,
    etr: 10.5
  },
  {
    name: '10pt8ion',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: 10.5
  },
  {
    name: 'Judgement',
    artist: 'xi',
    pst: 5.5,
    prs: 8.6,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Rain of Conflict in a Radiant Abyss',
    artist: 'xi',
    pst: 5.0,
    prs: 7.8,
    ftr: 9.5,
    byd: null,
    etr: 10.5
  },
  {
    name: 'Spirit of Dauntless',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'Straight into lights',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.5,
    byd: null,
    etr: 10.5
  },
  {
    name: 'MEGALOVANIA',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 9.5,
    byd: null,
    etr: 10.5
  },
  {
    name: 'Dull Blade',
    artist: 'xi',
    pst: 4.5,
    prs: 8.0,
    ftr: 10.5,
    byd: null,
    etr: null
  },
  {
    name: 'BlythE',
    artist: 'xi',
    pst: 3.0,
    prs: 7.5,
    ftr: 9.4,
    byd: null,
    etr: 10.5
  },
  {
    name: 'CHAOSBLAST',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.6,
    byd: null,
    etr: 10.5
  },
  {
    name: 'Xxium and Purple haze',
    artist: 'xi',
    pst: 2.5,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: 10.5
  },
  {
    name: 'γuarδina',
    artist: 'xi',
    pst: 4.0,
    prs: 8.0,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Garakuta Doll Play',
    artist: 'xi',
    pst: 4.5,
    prs: 6.5,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Felis',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Climax',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Last Celebration',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Kissing Lucifer',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'PUPA',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'IMPACT',
    artist: 'xi',
    pst: 3.5,
    prs: 7.8,
    ftr: 9.6,
    byd: 10.4,
    etr: null
  },
  {
    name: 'To: Milky Way',
    artist: 'xi',
    pst: 5.0,
    prs: 8.9,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Qovat',
    artist: 'xi',
    pst: 4.5,
    prs: 8.2,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Lethal Voltage',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'MIRINAE',
    artist: 'xi',
    pst: 4.5,
    prs: 8.3,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Rays of Remnant',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 9.7,
    byd: 10.4,
    etr: null
  },
  {
    name: 'Placebo♥Battler',
    artist: 'xi',
    pst: 5.5,
    prs: 8.3,
    ftr: 10.4,
    byd: null,
    etr: null
  },
  {
    name: 'Dual Dependency',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.5,
    byd: 10.4,
    etr: null
  },
  {
    name: 'Eternity Break',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.6,
    byd: 10.4,
    etr: null
  },
  {
    name: 'No Way Back',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 8.9,
    byd: 10.4,
    etr: null
  },
  {
    name: 'INCARNATOR₀₀',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.9,
    byd: 10.4,
    etr: null
  },
  {
    name: 'Metallic Punisher',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'Ether Strike',
    artist: 'xi',
    pst: 5.5,
    prs: 8.3,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'Tiferet',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'Ikazuchi',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'IZANA',
    artist: 'xi',
    pst: 5.0,
    prs: 8.3,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'To: Alice Liddell',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'Viyella\'s Tears',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'Hiiro Gekka, Kyoushou no Zetsu (nayuta 2017 ver.)',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: '99 Glooms',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'ultradiaxon-N3',
    artist: 'xi',
    pst: 4.5,
    prs: 8.5,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'Dual Doom Deathmatch',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.9,
    byd: 10.3,
    etr: null
  },
  {
    name: 'SUPER AMBULANCE',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: '8-EM',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.5,
    byd: 10.3,
    etr: null
  },
  {
    name: 'BREaK! BREaK! BREaK!',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.8,
    byd: 10.3,
    etr: null
  },
  {
    name: 'ROST PAGE GENE',
    artist: 'xi',
    pst: 5.0,
    prs: 8.2,
    ftr: 10.3,
    byd: null,
    etr: null
  },
  {
    name: 'zephyrlasting',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.5,
    byd: 10.3,
    etr: null
  },
  {
    name: 'Nirv lucE',
    artist: 'xi',
    pst: 2.5,
    prs: 7.0,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'αterlβus',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'conflict',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Valhalla:0',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Malicious Mischance',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Löschen',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Quon',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.7,
    byd: 10.2,
    etr: null
  },
  {
    name: 'lastendconductor',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.4,
    byd: 10.2,
    etr: null
  },
  {
    name: 'Redolent Shape',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'NEO WINGS',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Capella',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Magnolia',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Logos',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Renegade',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.6,
    byd: 10.2,
    etr: null
  },
  {
    name: 'Your Best Nightmare',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.9,
    byd: 10.2,
    etr: null
  },
  {
    name: 'Angel\'s Boundary',
    artist: 'xi',
    pst: 5.0,
    prs: 8.5,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'Grandspell',
    artist: 'xi',
    pst: 4.5,
    prs: 8.4,
    ftr: 10.2,
    byd: null,
    etr: null
  },
  {
    name: 'PRAGMATISM',
    artist: 'xi',
    pst: 4.5,
    prs: 8.6,
    ftr: 10.1,
    byd: 11.2,
    etr: null
  },
  {
    name: 'G e n g a o z o',
    artist: 'xi',
    pst: 4.0,
    prs: 8.1,
    ftr: 10.1,
    byd: null,
    etr: null
  },
  {
    name: 'Medusa',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 10.1,
    byd: null,
    etr: null
  },
  {
    name: 'Trrricksters!!',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.1,
    byd: null,
    etr: null
  },
  {
    name: 'Kanbu de Tomatte Sugu Tokeru',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 10.1,
    byd: null,
    etr: null
  },
  {
    name: 'Gensou no Satellite',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 8.7,
    byd: 10.1,
    etr: null
  },
  {
    name: 'BlazinG AIR',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.9,
    byd: 10.1,
    etr: null
  },
  {
    name: 'Don\'t Die',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.4,
    byd: 10.1,
    etr: null
  },
  {
    name: 'OBLIVION',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.5,
    byd: 10.1,
    etr: null
  },
  {
    name: 'INFINITE DIMENSION',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.6,
    byd: 10.1,
    etr: null
  },
  {
    name: 'Sheriruth',
    artist: 'xi',
    pst: 5.5,
    prs: 7.5,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Alexandrite',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Scarlet Lance',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Vicious Heroism',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 10.0,
    byd: 11.2,
    etr: null
  },
  {
    name: 'Xanatos',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Oshama Scramble!',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Bamboo',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'HIVEMIND',
    artist: 'xi',
    pst: 4.0,
    prs: 8.6,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Free Myself',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Masquerade Legion',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Chromafill',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Third Sun',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.4,
    byd: 10.0,
    etr: null
  },
  {
    name: 'TRPNO',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'Liar',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 10.0,
    byd: null,
    etr: null
  },
  {
    name: 'ΛZΛLEΛ',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.4,
    byd: 10.0,
    etr: null
  },
  {
    name: 'Modelista',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'trappola bewitching',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.9,
    byd: 10.6,
    etr: null
  },
  {
    name: 'Nhelv',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.9,
    byd: 10.9,
    etr: null
  },
  {
    name: 'Heavensdoor',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 9.9,
    byd: 10.8,
    etr: null
  },
  {
    name: 'Mirzam',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Antagonism',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Arcahv',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Galaxy Friends',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: '7thSense',
    artist: 'xi',
    pst: 3.0,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Summer Fireworks of Love',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Trap Crow',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Astra walkthrough',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'MAXRAGE',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'The Survivor (Game Edit)',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'New York Back Raise',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'INTERNET YAMERO',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Devillic Sphere',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Ultimate taste',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Amekagura',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Beautiful Dreamer',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'STARGATE EXTREME',
    artist: 'xi',
    pst: 4.0,
    prs: 6.0,
    ftr: 9.3,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Distortion Human',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Hypnotize',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 8.9,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Ashen 6oundary',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Swan Song',
    artist: 'xi',
    pst: 3.0,
    prs: 7.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'Shinchoku Doudesuka?',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 8.8,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Tic! Tac! Toe!',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 8.8,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Syriana',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 9.9,
    byd: null,
    etr: null
  },
  {
    name: 'incomplete one',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 8.8,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Vainspire',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 8.4,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Paradox Palette',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 8.8,
    byd: 9.9,
    etr: null
  },
  {
    name: 'SOUNDWiTCH',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Memory Forest',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Linear Accelerator',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Black Territory',
    artist: 'xi',
    pst: 3.0,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Corruption',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Heavenly caress',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Einherjar Joker',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.8,
    byd: 10.9,
    etr: null
  },
  {
    name: 'Lost Desire',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Altale',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 9.8,
    byd: 10.0,
    etr: null
  },
  {
    name: 'Scarlet Cage',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Got hive of Ra',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Xeraphinite',
    artist: 'xi',
    pst: 3.0,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Far Away Light',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'THE ULTIMACY',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Mazy Metroplex',
    artist: 'xi',
    pst: 3.0,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Ascent',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Haze of Autumn',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'init()',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Macrocosmic Modulation',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Protoflicker',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Defection',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Callima Karma',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Ai Drew',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'FLUFFY FLASH',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'World Fragments III(radio edit)',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Genesis',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Hybris (The one who shattered)',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'RGB',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Kanjou no Matenrou ～Arr.Demetori',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'To Furthest Dream',
    artist: 'xi',
    pst: 4.5,
    prs: 8.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Technicolour',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Nameless Passion',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Ouvertüre',
    artist: 'xi',
    pst: 2.5,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'LIVHT MY WΔY',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'MORNINGLOOM',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 8.8,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Old School Salvage',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'HYPER VISION',
    artist: 'xi',
    pst: 4.5,
    prs: 7.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'shrink',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Waltz for Lorelei',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 8.8,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Crimson Quartz',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.8,
    byd: 9.8,
    etr: null
  },
  {
    name: 'LiftOff',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 8.2,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Ignition',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'yomibito_shirazu',
    artist: 'xi',
    pst: 4.5,
    prs: 8.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'Won\'t Back Down',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'U.A.D',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.7,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Miles',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.2,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Scarlet Lunar Empress',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.8,
    byd: null,
    etr: null
  },
  {
    name: 'disintegration',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 8.3,
    byd: 9.8,
    etr: null
  },
  {
    name: 'taboo tears you up 2017',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 8.4,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Lethaeus',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'The Message',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Sulfur',
    artist: 'xi',
    pst: 4.0,
    prs: 6.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Fallensquare',
    artist: 'xi',
    pst: 3.0,
    prs: 7.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'DX Choseinou Full Metal Shojo',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'SUPERNOVA',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Dreadnought',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Monochrome Princess',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Filament',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'BATTLE NO.1',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'BLRINK',
    artist: 'xi',
    pst: 3.5,
    prs: 7.8,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'amygdata',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Black Lotus',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'BADTEK',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Heart Jackin\'',
    artist: 'xi',
    pst: 3.0,
    prs: 5.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Dazzle hop',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Vandalism',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'AlterAle',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'goldenslaughterer',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'nέο κόsmo',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'μ',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Loveless Dress',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Last | Eternity',
    artist: 'xi',
    pst: null,
    prs: null,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Let\'s Rock (Arcaea mix)',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Lost in Abyss',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'SACRIFICE feat. ayame',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'B.B.K.K.B.K.K.',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Hotarubi no Yuki',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Luna Rossa',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Innocence',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 8.5,
    byd: 9.7,
    etr: null
  },
  {
    name: 'IONOSTREAM',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 8.7,
    byd: 9.7,
    etr: null
  },
  {
    name: 'Awaken In Ruins',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Hailstone',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Last Goodbye',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 8.2,
    byd: 9.7,
    etr: null
  },
  {
    name: 'Black Mirror on Wall',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.6,
    byd: 9.7,
    etr: null
  },
  {
    name: 'τ (tau)',
    artist: 'xi',
    pst: 4.5,
    prs: 7.8,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Acheron',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.7,
    byd: null,
    etr: null
  },
  {
    name: 'Particle',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 9.5,
    byd: 9.7,
    etr: null
  },
  {
    name: 'Quon',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'carmine:scythe',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'LunarOrbit -believe in Espebranch road-',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'Astral tale',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'Vindication',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'A Wandering Melody of Love',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'Avant Raze',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'Purple Verse',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.6,
    byd: 10.6,
    etr: null
  },
  {
    name: 'Lazy Addiction',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'ENERGY SYNERGY MATRIX',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.6,
    byd: 10.3,
    etr: null
  },
  {
    name: 'Last',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.0,
    byd: 9.6,
    etr: null
  },
  {
    name: 'Heart',
    artist: 'xi',
    pst: 1.0,
    prs: 5.0,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'Remind Souls (Short Version)',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'Stratoliner',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'Alone & Lorn',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.6,
    byd: null,
    etr: null
  },
  {
    name: 'epitaxy',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.6,
    byd: 9.6,
    etr: null
  },
  {
    name: 'See Lights!',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.6,
    byd: 9.6,
    etr: null
  },
  {
    name: 'Factorder',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 8.6,
    byd: 9.6,
    etr: null
  },
  {
    name: 'DataErr0r',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'Cybernecia Catharsis',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.5,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Illegal Paradise',
    artist: 'xi',
    pst: 2.0,
    prs: 7.0,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'STAGER (ALL STAGE CLEAR)',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'OMAKENO Stroke',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.5,
    byd: 10.3,
    etr: null
  },
  {
    name: 'MAHOROBA',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'ΟΔΥΣΣΕΙΑ',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'Evening in Scarlet',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'NULCTRL',
    artist: 'xi',
    pst: 3.0,
    prs: 7.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'GIMMICK',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'Dynitikós',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'Transient Space',
    artist: 'xi',
    pst: 2.5,
    prs: 7.0,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'felys final remix',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'On And On!! feat. Jenga',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'Jingle',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 7.8,
    byd: 9.5,
    etr: null
  },
  {
    name: '〇、',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'In Vain',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'astral.exe',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'End of The Moonlight',
    artist: 'xi',
    pst: 3.0,
    prs: 5.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'SATISFACTION',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 8.5,
    byd: 9.5,
    etr: null
  },
  {
    name: 'Someday',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'Viola Illyria',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 9.5,
    byd: null,
    etr: null
  },
  {
    name: 'Party Vinyl',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.4,
    byd: 10.3,
    etr: null
  },
  {
    name: 'CROSS†SOUL',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Your voice so... feat. Such',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Impure Bird',
    artist: 'xi',
    pst: 2.0,
    prs: 5.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Dreamin\' Attraction!!',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Red and Blue',
    artist: 'xi',
    pst: 4.0,
    prs: 7.8,
    ftr: 9.4,
    byd: 10.2,
    etr: null
  },
  {
    name: 'Yosakura Fubuki',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Specta',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Be There',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'VECTOЯ',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'AI[UE]OON',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Equilibrium',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Teriqma',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.4,
    byd: 9.7,
    etr: null
  },
  {
    name: 'CROSS†OVER',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Lapis',
    artist: 'xi',
    pst: 2.0,
    prs: 6.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Crystal Gravity',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'with U',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Let you DIVE! (nitro rmx)',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Final Step!',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Sakura Fubuki',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Head BONK ache',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'PICO-Pico-Translation!',
    artist: 'xi',
    pst: 2.0,
    prs: 6.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Redraw Colorless World',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'MANTIS (Arcaea Ultra-Bloodrush VIP)',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'DRG',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'Raven\'s Pride',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'FANTA5Y',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'FURETE-MITAI',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.4,
    byd: 9.4,
    etr: null
  },
  {
    name: 'Death By Glamour',
    artist: 'xi',
    pst: 2.5,
    prs: 5.0,
    ftr: 7.8,
    byd: 9.4,
    etr: null
  },
  {
    name: 'I want You',
    artist: 'xi',
    pst: 3.0,
    prs: 5.5,
    ftr: 8.3,
    byd: 9.4,
    etr: null
  },
  {
    name: 'mod',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.4,
    byd: null,
    etr: null
  },
  {
    name: 'GOODTEK (Arcaea Edit)',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 9.3,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Oracle',
    artist: 'xi',
    pst: 3.0,
    prs: 5.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Ignotus',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.3,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Auxesia',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Syro',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Blaster',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Feels So Right feat. Renko',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Glow',
    artist: 'xi',
    pst: 4.0,
    prs: 7.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Can I Friend You on Bassbook? Lol',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Small Cloud Sugar Candy',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'False Embellishment',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Blocked Library',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Lost Emotion feat. nomico',
    artist: 'xi',
    pst: 3.5,
    prs: 7.0,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'The Formula',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'HELLOHELL',
    artist: 'xi',
    pst: 2.5,
    prs: 5.0,
    ftr: 7.5,
    byd: 9.3,
    etr: null
  },
  {
    name: 'Floating World',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.3,
    byd: null,
    etr: null
  },
  {
    name: 'Lost Civilization',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.2,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Anökumene',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 9.2,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Strongholds',
    artist: 'xi',
    pst: 2.5,
    prs: 5.0,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'Rugie',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'Phantasia',
    artist: 'xi',
    pst: 4.0,
    prs: 5.5,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'Libertas',
    artist: 'xi',
    pst: 3.5,
    prs: 5.5,
    ftr: 9.2,
    byd: 10.5,
    etr: null
  },
  {
    name: 'Alice à la mode',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'Dancin\' on a Cat\'s Paw',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'cocoro*cosmetic',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'Used to be',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'Leave All Behind',
    artist: 'xi',
    pst: 2.0,
    prs: 5.5,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'Sign of "10.5km"',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.2,
    byd: null,
    etr: null
  },
  {
    name: 'Ladymade Star',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 8.4,
    byd: 9.2,
    etr: null
  },
  {
    name: 'qualia -ideaesthesia-',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 9.1,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Essence of Twilight',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'Iconoclast',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'Journey',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'dropdead',
    artist: 'xi',
    pst: 1.5,
    prs: 9.5,
    ftr: 9.1,
    byd: 10.5,
    etr: null
  },
  {
    name: 'Empire of Winter',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'ReviXy',
    artist: 'xi',
    pst: 3.0,
    prs: 7.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'La\'qryma of Wasteland',
    artist: 'xi',
    pst: 3.5,
    prs: 6.5,
    ftr: 9.1,
    byd: 10.0,
    etr: null
  },
  {
    name: 'Faint Light (Arcaea Edit)',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'Alice\'s Suitcase',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'Life is PIANO',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'Coastal Highway',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'Blue Rose',
    artist: 'xi',
    pst: 2.0,
    prs: 6.0,
    ftr: 9.1,
    byd: null,
    etr: null
  },
  {
    name: 'Prayer',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 8.2,
    byd: 9.1,
    etr: null
  },
  {
    name: 'Flyburg and Endroll',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.0,
    byd: null,
    etr: null
  },
  {
    name: 'Kanagawa Cyber Culvert',
    artist: 'xi',
    pst: 1.0,
    prs: 5.5,
    ftr: 9.0,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Jump',
    artist: 'xi',
    pst: 4.0,
    prs: 6.0,
    ftr: 9.0,
    byd: null,
    etr: null
  },
  {
    name: 'Turbocharger',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 9.0,
    byd: null,
    etr: null
  },
  {
    name: 'Galactic Love',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 9.0,
    byd: null,
    etr: null
  },
  {
    name: 'Lawless Point',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 9.0,
    byd: null,
    etr: null
  },
  {
    name: 'Primeval Texture',
    artist: 'xi',
    pst: 3.0,
    prs: 7.5,
    ftr: 9.0,
    byd: null,
    etr: null
  },
  {
    name: 'memoryfactory.lzh',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 8.9,
    byd: null,
    etr: null
  },
  {
    name: 'Flashback',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 8.9,
    byd: null,
    etr: null
  },
  {
    name: 'Chronostasis',
    artist: 'xi',
    pst: 3.5,
    prs: 7.5,
    ftr: 8.9,
    byd: null,
    etr: null
  },
  {
    name: 'Evoltex (poppi\'n mix)',
    artist: 'xi',
    pst: 2.0,
    prs: 7.0,
    ftr: 8.9,
    byd: null,
    etr: null
  },
  {
    name: 'Maze No.9',
    artist: 'xi',
    pst: 3.0,
    prs: 3.5,
    ftr: 8.9,
    byd: null,
    etr: null
  },
  {
    name: 'MERLIN',
    artist: 'xi',
    pst: 3.0,
    prs: 5.5,
    ftr: 8.9,
    byd: 9.4,
    etr: null
  },
  {
    name: 'Chelsea',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.9,
    byd: null,
    etr: null
  },
  {
    name: 'Give Me a Nightmare',
    artist: 'xi',
    pst: 3.5,
    prs: 5.5,
    ftr: 8.9,
    byd: null,
    etr: null
  },
  {
    name: 'Lights of Muse',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.9,
    byd: null,
    etr: null
  },
  {
    name: 'Surrender',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 8.8,
    byd: null,
    etr: null
  },
  {
    name: 'next to you',
    artist: 'xi',
    pst: 4.5,
    prs: 7.0,
    ftr: 8.8,
    byd: 9.6,
    etr: null
  },
  {
    name: 'Solitary Dream',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 8.8,
    byd: null,
    etr: null
  },
  {
    name: 'Antithese',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 8.8,
    byd: 9.6,
    etr: null
  },
  {
    name: 'Vivid Theory',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 8.8,
    byd: null,
    etr: null
  },
  {
    name: 'Cosmica',
    artist: 'xi',
    pst: 2.5,
    prs: 5.0,
    ftr: 8.8,
    byd: null,
    etr: null
  },
  {
    name: 'Dialnote',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.8,
    byd: null,
    etr: null
  },
  {
    name: 'CYCLES',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 8.8,
    byd: null,
    etr: null
  },
  {
    name: 'Cosmo Pop Funclub',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.8,
    byd: null,
    etr: null
  },
  {
    name: 'Hidden Rainbows of Epicurus',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 7.5,
    byd: 8.8,
    etr: null
  },
  {
    name: 'Saint or Sinner',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.8,
    byd: null,
    etr: null
  },
  {
    name: 'cry of viyella',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 8.7,
    byd: null,
    etr: null
  },
  {
    name: 'Call My Name feat. Yukacco',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 8.7,
    byd: null,
    etr: null
  },
  {
    name: 'Grimheart',
    artist: 'xi',
    pst: 2.5,
    prs: 5.0,
    ftr: 8.7,
    byd: null,
    etr: null
  },
  {
    name: 'Senkyou',
    artist: 'xi',
    pst: 3.0,
    prs: 5.5,
    ftr: 8.7,
    byd: null,
    etr: null
  },
  {
    name: 'Beside You',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.7,
    byd: null,
    etr: null
  },
  {
    name: 'Paper Witch',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 8.7,
    byd: null,
    etr: null
  },
  {
    name: 'Tsuki ni Murakumo, Hana ni Kaze',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.7,
    byd: null,
    etr: null
  },
  {
    name: 'WAIT FOR DAWN',
    artist: 'xi',
    pst: 2.5,
    prs: 7.8,
    ftr: 8.7,
    byd: null,
    etr: null
  },
  {
    name: 'Heartache',
    artist: 'xi',
    pst: 1.5,
    prs: 4.5,
    ftr: 7.5,
    byd: 8.7,
    etr: null
  },
  {
    name: 'Wake in Hour',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 7.5,
    byd: 8.7,
    etr: null
  },
  {
    name: 'Silent Rush',
    artist: 'xi',
    pst: 2.5,
    prs: 5.0,
    ftr: 8.6,
    byd: null,
    etr: null
  },
  {
    name: 'FREEF4LL',
    artist: 'xi',
    pst: 4.0,
    prs: 7.0,
    ftr: 8.6,
    byd: 9.8,
    etr: null
  },
  {
    name: 'Gekka (Short Version)',
    artist: 'xi',
    pst: 4.0,
    prs: 6.5,
    ftr: 8.6,
    byd: null,
    etr: null
  },
  {
    name: 'April showers',
    artist: 'xi',
    pst: 2.0,
    prs: 5.5,
    ftr: 8.6,
    byd: null,
    etr: null
  },
  {
    name: 'enchanted love',
    artist: 'xi',
    pst: 2.0,
    prs: 4.5,
    ftr: 8.6,
    byd: null,
    etr: null
  },
  {
    name: 'Babaroque',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 8.5,
    byd: null,
    etr: null
  },
  {
    name: 'Dandelion',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.5,
    byd: null,
    etr: null
  },
  {
    name: 'Harutopia ~Utopia of Spring~',
    artist: 'xi',
    pst: 1.0,
    prs: 4.5,
    ftr: 8.5,
    byd: null,
    etr: null
  },
  {
    name: 'Reinvent',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 8.5,
    byd: null,
    etr: null
  },
  {
    name: 'DDD',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 8.5,
    byd: null,
    etr: null
  },
  {
    name: 'Altair (feat. *spiLa*)',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.5,
    byd: null,
    etr: null
  },
  {
    name: 'syūten',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 8.5,
    byd: null,
    etr: null
  },
  {
    name: 'Snow White',
    artist: 'xi',
    pst: 2.5,
    prs: 5.0,
    ftr: 8.4,
    byd: 9.7,
    etr: null
  },
  {
    name: 'Lumia',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 8.4,
    byd: 9.5,
    etr: null
  },
  {
    name: 'REconstruction',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.4,
    byd: null,
    etr: null
  },
  {
    name: 'Moonheart',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 8.4,
    byd: 9.7,
    etr: null
  },
  {
    name: 'Rabbit In The Black Room',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 8.4,
    byd: null,
    etr: null
  },
  {
    name: 'Purgatorium',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.4,
    byd: 9.6,
    etr: null
  },
  {
    name: 'Eccentric Tale',
    artist: 'xi',
    pst: 2.0,
    prs: 5.5,
    ftr: 8.4,
    byd: null,
    etr: null
  },
  {
    name: 'INTERNET OVERDOSE',
    artist: 'xi',
    pst: 3.0,
    prs: 6.5,
    ftr: 8.4,
    byd: null,
    etr: null
  },
  {
    name: 'Shades of Light in a Transcendent Realm',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.3,
    byd: 9.1,
    etr: null
  },
  {
    name: 'Bookmaker (2D Version)',
    artist: 'xi',
    pst: 4.5,
    prs: 6.5,
    ftr: 8.3,
    byd: 10.0,
    etr: null
  },
  {
    name: 'Dot to Dot feat. shully',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.3,
    byd: null,
    etr: null
  },
  {
    name: 'Tie me down gently',
    artist: 'xi',
    pst: 3.0,
    prs: 5.5,
    ftr: 8.3,
    byd: null,
    etr: null
  },
  {
    name: 'Oblivia',
    artist: 'xi',
    pst: 3.5,
    prs: 5.0,
    ftr: 8.3,
    byd: 9.7,
    etr: null
  },
  {
    name: 'Ävril -Flicka i krans-',
    artist: 'xi',
    pst: 3.0,
    prs: 6.0,
    ftr: 8.3,
    byd: null,
    etr: null
  },
  {
    name: 'san skia',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 8.3,
    byd: null,
    etr: null
  },
  {
    name: 'Dematerialized',
    artist: 'xi',
    pst: 1.5,
    prs: 4.5,
    ftr: 7.5,
    byd: 8.3,
    etr: null
  },
  {
    name: 'Lucifer',
    artist: 'xi',
    pst: 3.5,
    prs: 5.5,
    ftr: 8.2,
    byd: null,
    etr: null
  },
  {
    name: 'Genesis',
    artist: 'xi',
    pst: 2.0,
    prs: 5.5,
    ftr: 8.2,
    byd: null,
    etr: null
  },
  {
    name: 'One Last Drive',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 8.2,
    byd: null,
    etr: null
  },
  {
    name: 'Hall of Mirrors',
    artist: 'xi',
    pst: 3.0,
    prs: 5.5,
    ftr: 8.2,
    byd: null,
    etr: null
  },
  {
    name: '1F√',
    artist: 'xi',
    pst: 2.5,
    prs: 6.5,
    ftr: 8.2,
    byd: null,
    etr: null
  },
  {
    name: 'blue comet',
    artist: 'xi',
    pst: 3.5,
    prs: 5.0,
    ftr: 8.2,
    byd: null,
    etr: null
  },
  {
    name: 'I\'ve heard it said',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 8.1,
    byd: null,
    etr: null
  },
  {
    name: 'Hikari',
    artist: 'xi',
    pst: 2.5,
    prs: 6.0,
    ftr: 8.1,
    byd: null,
    etr: null
  },
  {
    name: 'Diode',
    artist: 'xi',
    pst: 2.5,
    prs: 5.5,
    ftr: 8.1,
    byd: null,
    etr: null
  },
  {
    name: 'Bullet Waiting for Me (James Landino remix)',
    artist: 'xi',
    pst: 2.5,
    prs: 4.5,
    ftr: 8.1,
    byd: null,
    etr: null
  },
  {
    name: 'Relentless',
    artist: 'xi',
    pst: 4.5,
    prs: 6.5,
    ftr: 8.0,
    byd: null,
    etr: null
  },
  {
    name: 'world.execute(me);',
    artist: 'xi',
    pst: 3.5,
    prs: 5.0,
    ftr: 8.0,
    byd: null,
    etr: null
  },
  {
    name: 'Prism',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 8.0,
    byd: null,
    etr: null
  },
  {
    name: 'Rise',
    artist: 'xi',
    pst: 2.5,
    prs: 4.0,
    ftr: 7.8,
    byd: null,
    etr: null
  },
  {
    name: 'Dement ~after legend~',
    artist: 'xi',
    pst: 3.5,
    prs: 6.0,
    ftr: 7.8,
    byd: 9.9,
    etr: null
  },
  {
    name: 'Infinity Heaven',
    artist: 'xi',
    pst: 1.5,
    prs: 5.5,
    ftr: 7.8,
    byd: 9.6,
    etr: null
  },
  {
    name: 'Brand new world',
    artist: 'xi',
    pst: 2.0,
    prs: 4.0,
    ftr: 7.8,
    byd: null,
    etr: null
  },
  {
    name: 'Paradise',
    artist: 'xi',
    pst: 1.0,
    prs: 4.0,
    ftr: 7.8,
    byd: null,
    etr: null
  },
  {
    name: 'Clotho and stargazer',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 7.8,
    byd: 8.8,
    etr: null
  },
  {
    name: 'Moonlight of Sand Castle',
    artist: 'xi',
    pst: 1.5,
    prs: 5.0,
    ftr: 7.8,
    byd: null,
    etr: null
  },
  {
    name: 'Romance Wars',
    artist: 'xi',
    pst: 1.0,
    prs: 4.0,
    ftr: 7.8,
    byd: null,
    etr: null
  },
  {
    name: 'Dream goes on',
    artist: 'xi',
    pst: 1.5,
    prs: 5.0,
    ftr: 7.8,
    byd: null,
    etr: null
  },
  {
    name: 'inkar-usi',
    artist: 'xi',
    pst: 2.0,
    prs: 4.0,
    ftr: 7.8,
    byd: 9.4,
    etr: null
  },
  {
    name: 'Suomi',
    artist: 'xi',
    pst: 2.0,
    prs: 5.0,
    ftr: 7.8,
    byd: 8.9,
    etr: null
  },
  {
    name: 'First Snow',
    artist: 'xi',
    pst: 2.5,
    prs: 4.5,
    ftr: 7.8,
    byd: null,
    etr: null
  },
  {
    name: 'Sayonara Hatsukoi',
    artist: 'xi',
    pst: 1.5,
    prs: 4.5,
    ftr: 7.0,
    byd: 8.5,
    etr: null
  },
  {
    name: 'Fairytale',
    artist: 'xi',
    pst: 1.0,
    prs: 3.5,
    ftr: 7.0,
    byd: 9.5,
    etr: null
  },
  {
    name: 'Vexaria',
    artist: 'xi',
    pst: 2.5,
    prs: 5.0,
    ftr: 7.0,
    byd: 9.0,
    etr: null
  },
  {
    name: 'Blossoms',
    artist: 'xi',
    pst: 1.0,
    prs: 4.0,
    ftr: 7.0,
    byd: null,
    etr: null
  }
]

/**
 * 获取歌曲数据
 * @returns 歌曲数据数组
 */
function getSongsData() {
  return songsData
}

/**
 * 根据歌曲名称获取歌曲数据
 * @param name 歌曲名称
 * @returns 歌曲数据对象，如果不存在则返回null
 */
function getSongByName(name) {
  return songsData.find(song => song.name === name) || null
}

/**
 * 根据歌曲名称获取歌曲定数
 * @param name 歌曲名称
 * @param difficulty 难度 (pst, prs, ftr, byd, etr)
 * @returns 定数，如果不存在则返回null
 */
function getSongConstant(name, difficulty) {
  const song = getSongByName(name)
  return song ? song[difficulty] : null
}

/**
 * 获取所有歌曲名称
 * @returns 歌曲名称数组
 */
function getSongNames() {
  return songsData.map(song => song.name)
}

/**
 * 获取指定难度的所有歌曲
 * @param difficulty 难度 (pst, prs, ftr, byd, etr)
 * @returns 指定难度的歌曲数组
 */
function getSongsByDifficulty(difficulty) {
  return songsData.filter(song => song[difficulty] !== null && song[difficulty] !== undefined)
}

/**
 * 根据定数范围获取歌曲
 * @param difficulty 难度 (pst, prs, ftr, byd, etr)
 * @param minConstant 最小定数
 * @param maxConstant 最大定数
 * @returns 符合条件的歌曲数组
 */
function getSongsByConstantRange(difficulty, minConstant, maxConstant) {
  return songsData.filter(song => {
    const constant = song[difficulty]
    return constant !== null && 
           constant !== undefined && 
           constant >= minConstant && 
           constant < maxConstant
  })
}

// 导出函数
export {
  getSongsData,
  getSongByName,
  getSongConstant,
  getSongNames,
  getSongsByDifficulty,
  getSongsByConstantRange
}

// 默认导出
export default {
  getSongsData,
  getSongByName,
  getSongConstant,
  getSongNames,
  getSongsByDifficulty,
  getSongsByConstantRange
}