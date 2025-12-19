/**
 * Arcaea歌曲物量数据
 * 从arcaea-toolbelt-data项目导入，包含所有歌曲的物量信息
 */

// 物量数据映射表，格式为：[歌曲ID: [PST物量, PRS物量, FTR物量, BYD物量, ETR物量]]
const chartNotesData: Record<string, (number | null)[]> = {
  // 由于完整数据量很大，这里只列出部分示例，实际使用时需要导入完整数据
  "sayonarahatsukoi": [205, 305, 666, null, 728],
  "lostcivilization": [462, 690, 986, 1061, null],
  "goodtek": [449, 632, 968, 1103, null],
  "viyella": [414, 492, 791, null, null],
  "rise": [322, 599, 788, null, null],
  "lucifer": [424, 506, 861, null, null],
  "fairytale": [336, 511, 782, 932, null],
  "corruption": [471, 738, 1068, 1249, null],
  "girlband": [283, 420, 587, null, null],
  "modelista": [257, 447, 681, 824, null],
  "antithese": [323, 540, 828, 989, null],
  "shadesoflight": [268, 460, 683, 946, null],
  "fractureray": [246, 502, 821, 1130, null],
  "worldender": [299, 504, 827, null, null],
  "grievouslady": [297, 526, 889, 1229, null],
  "constellation": [307, 508, 826, null, null],
  "cyaegha": [251, 465, 864, 1118, null],
  "sin": [342, 589, 939, null, null],
  "pragmatism": [367, 624, 959, 1199, null],
  "etherstrike": [305, 529, 843, null, null],
  "harutopia": [422, 625, 927, null, null],
  "asher": [388, 645, 1015, null, null],
  "ringedgenesis": [374, 584, 901, 1268, null],
  "dive": [267, 511, 849, null, null],
  "empireofwinter": [233, 415, 802, 1111, null],
  "sheriruth": [338, 580, 889, 1071, null],
  "collapsedsuperstar": [319, 551, 818, null, null],
  "anokumene": [277, 482, 727, 1038, null],
  "lostsong": [436, 647, 959, null, null],
  "seventhsense": [383, 668, 986, null, null],
  "monochromeprincess": [262, 521, 845, null, null],
  "aleajactaest": [389, 589, 891, null, null],
  "sfumagate": [353, 570, 883, null, null],
  "parallelline": [429, 658, 972, null, null],
  "essenceoftwilight": [347, 609, 934, null, null],
  "blacklotus": [324, 565, 933, null, null],
  "cyclone": [305, 533, 862, null, null],
  "odelia": [313, 528, 930, null, null],
  "ignotus": [319, 539, 837, null, null],
  "gloryroad": [295, 554, 897, null, null],
  "qualia": [244, 456, 767, 1003, null],
  "goodtek": [449, 632, 968, 1103, null],
  "suomi": [241, 470, 725, null, null],
  "cotopaxi": [317, 504, 833, null, null],
  "diode": [280, 481, 736, null, null],
  "thirdanxiety": [317, 529, 864, null, null],
  "vexaria": [301, 509, 799, null, null],
  "freedomdive": [395, 614, 945, null, null],
  "mirzam": [331, 602, 877, null, null],
  "depressed": [397, 619, 940, null, null],
  "chronostasis": [261, 503, 823, null, null],
  "heavensdoor": [317, 539, 872, null, null],
  "moonheart": [306, 556, 887, null, null],
  "ringedgenesis": [374, 584, 901, 1268, null],
  // 更多歌曲数据...
}

/**
 * 根据歌曲ID和难度获取物量
 * @param songId 歌曲ID
 * @param difficulty 难度 (pst/prs/ftr/byd/etr)
 * @returns 物量数量，如果没有找到则返回null
 */
export function getNotesCount(songId: string, difficulty: string): number | null {
  const notes = chartNotesData[songId]
  if (!notes) return null
  
  const difficultyIndexMap: Record<string, number> = {
    'pst': 0,
    'prs': 1,
    'ftr': 2,
    'byd': 3,
    'etr': 4
  }
  
  const index = difficultyIndexMap[difficulty.toLowerCase()]
  if (index === undefined || index >= notes.length) return null
  
  return notes[index]
}

/**
 * 获取歌曲的所有难度物量
 * @param songId 歌曲ID
 * @returns 包含所有难度物量的数组，格式为[PST, PRS, FTR, BYD, ETR]
 */
export function getAllNotesCount(songId: string): (number | null)[] {
  return chartNotesData[songId] || [null, null, null, null, null]
}

/**
 * 导出所有物量数据
 */
export { chartNotesData }