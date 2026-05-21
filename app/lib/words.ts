import type { Locale } from "./i18n"

export type BadgeKey = "community" | "rising" | "poetic"
export type WordSource = "static" | "database"

export type DefinitionOption = {
  id: string
  text: string
  votes: number
  badge?: BadgeKey
}

export type InventedWord = {
  source?: WordSource
  locale: Locale
  slug: string
  word: string
  pronunciation: string
  originHint: string
  officialDefinition: string
  example: string
  options: DefinitionOption[]
}

type SeedWord = Omit<InventedWord, "source" | "officialDefinition" | "locale">

export const inventedWordsByLocale = {
  "en": [
    {
      "slug": "brumiso",
      "word": "Brumiso",
      "pronunciation": "broo-mee-so",
      "originHint": "Soft weather + quiet feeling",
      "example": "The café window filled me with brumiso as the rain started.",
      "options": [
        {
          "id": "en-brumiso-a",
          "text": "A quiet feeling of comfort when soft rain begins.",
          "votes": 184,
          "badge": "community"
        },
        {
          "id": "en-brumiso-b",
          "text": "A tiny mistake you notice only after sending a message.",
          "votes": 92
        },
        {
          "id": "en-brumiso-c",
          "text": "The soft blur of city lights seen through wet glass.",
          "votes": 138,
          "badge": "poetic"
        },
        {
          "id": "en-brumiso-d",
          "text": "A rare mountain flower that opens only at dawn.",
          "votes": 57
        }
      ]
    },
    {
      "slug": "lumelune",
      "word": "Lumelune",
      "pronunciation": "loo-meh-loon",
      "originHint": "Light + moon mood",
      "example": "Finishing the bug at 1 a.m. gave me pure lumelune.",
      "options": [
        {
          "id": "en-lumelune-a",
          "text": "The gentle confidence you feel after solving something late at night.",
          "votes": 211,
          "badge": "community"
        },
        {
          "id": "en-lumelune-b",
          "text": "A song you only like when walking alone.",
          "votes": 70
        },
        {
          "id": "en-lumelune-c",
          "text": "The glow of a room right before everyone wakes up.",
          "votes": 158,
          "badge": "rising"
        },
        {
          "id": "en-lumelune-d",
          "text": "A polite way to refuse a second dessert.",
          "votes": 44
        }
      ]
    },
    {
      "slug": "clavernel",
      "word": "Clavernel",
      "pronunciation": "kla-ver-nel",
      "originHint": "Key + hidden pattern",
      "example": "That diagram was the clavernel I needed.",
      "options": [
        {
          "id": "en-clavernel-a",
          "text": "A small clue that suddenly makes a confusing idea clear.",
          "votes": 176,
          "badge": "community"
        },
        {
          "id": "en-clavernel-b",
          "text": "The sound of keys moving in a coat pocket.",
          "votes": 66
        },
        {
          "id": "en-clavernel-c",
          "text": "A forgotten password that returns to memory at the last second.",
          "votes": 81
        },
        {
          "id": "en-clavernel-d",
          "text": "A shortcut that feels obvious only after someone shows it to you.",
          "votes": 149,
          "badge": "rising"
        }
      ]
    },
    {
      "slug": "seravelle",
      "word": "Seravelle",
      "pronunciation": "seh-rah-vel",
      "originHint": "Calm + evening breeze",
      "example": "Before the interview, I took one seravelle and breathed.",
      "options": [
        {
          "id": "en-seravelle-a",
          "text": "The peaceful pause before starting something important.",
          "votes": 193,
          "badge": "community"
        },
        {
          "id": "en-seravelle-b",
          "text": "A window left open just enough for fresh air.",
          "votes": 89
        },
        {
          "id": "en-seravelle-c",
          "text": "The calm sound of pages turning in a quiet room.",
          "votes": 131,
          "badge": "poetic"
        },
        {
          "id": "en-seravelle-d",
          "text": "A tiny dessert served after midnight.",
          "votes": 36
        }
      ]
    }
  ],
  "fr": [
    {
      "slug": "pluvame",
      "word": "Pluvâme",
      "pronunciation": "plu-vam",
      "originHint": "Pluie + âme tranquille",
      "example": "En regardant tomber la pluie, j’ai senti une vraie pluvâme.",
      "options": [
        {
          "id": "fr-pluvame-a",
          "text": "La paix intérieure qu’on ressent quand une pluie douce commence.",
          "votes": 196,
          "badge": "community"
        },
        {
          "id": "fr-pluvame-b",
          "text": "Une envie soudaine d’écrire sans savoir pourquoi.",
          "votes": 101
        },
        {
          "id": "fr-pluvame-c",
          "text": "Le reflet flou des lumières sur un trottoir mouillé.",
          "votes": 154,
          "badge": "poetic"
        },
        {
          "id": "fr-pluvame-d",
          "text": "Un vieux parapluie qu’on garde par habitude.",
          "votes": 49
        }
      ]
    },
    {
      "slug": "clartive",
      "word": "Clartive",
      "pronunciation": "klar-tiv",
      "originHint": "Clarté + idée active",
      "example": "Après ton schéma, tout est devenu clartive.",
      "options": [
        {
          "id": "fr-clartive-a",
          "text": "Le moment où une idée compliquée devient soudainement simple.",
          "votes": 205,
          "badge": "community"
        },
        {
          "id": "fr-clartive-b",
          "text": "Une lumière douce qui entre dans une pièce le matin.",
          "votes": 119,
          "badge": "poetic"
        },
        {
          "id": "fr-clartive-c",
          "text": "Une réponse courte qui règle un long problème.",
          "votes": 142,
          "badge": "rising"
        },
        {
          "id": "fr-clartive-d",
          "text": "Une ancienne clé trouvée dans un tiroir.",
          "votes": 38
        }
      ]
    },
    {
      "slug": "sourilege",
      "word": "Sourilège",
      "pronunciation": "sou-ri-lej",
      "originHint": "Sourire + petit sortilège",
      "example": "Son message avait un sourilège impossible à expliquer.",
      "options": [
        {
          "id": "fr-sourilege-a",
          "text": "Un petit sourire qui change l’ambiance d’une journée entière.",
          "votes": 188,
          "badge": "community"
        },
        {
          "id": "fr-sourilege-b",
          "text": "Une blague très discrète comprise par une seule personne.",
          "votes": 126,
          "badge": "rising"
        },
        {
          "id": "fr-sourilege-c",
          "text": "La magie légère d’un souvenir heureux qui revient sans prévenir.",
          "votes": 155,
          "badge": "poetic"
        },
        {
          "id": "fr-sourilege-d",
          "text": "Un bonbon qu’on retrouve au fond d’un sac.",
          "votes": 33
        }
      ]
    },
    {
      "slug": "velonuit",
      "word": "Vélonuit",
      "pronunciation": "ve-lo-nui",
      "originHint": "Veillée + nuit calme",
      "example": "Coder tard sans stress, c’était un vrai vélonuit.",
      "options": [
        {
          "id": "fr-velonuit-a",
          "text": "La concentration douce qu’on trouve tard le soir quand tout devient silencieux.",
          "votes": 214,
          "badge": "community"
        },
        {
          "id": "fr-velonuit-b",
          "text": "Le courage tranquille de terminer une tâche avant de dormir.",
          "votes": 139,
          "badge": "rising"
        },
        {
          "id": "fr-velonuit-c",
          "text": "Le bleu profond du ciel juste avant minuit.",
          "votes": 118,
          "badge": "poetic"
        },
        {
          "id": "fr-velonuit-d",
          "text": "Une promenade à vélo sous la lune.",
          "votes": 52
        }
      ]
    }
  ],
  "es": [
    {
      "slug": "lluvisma",
      "word": "Lluvisma",
      "pronunciation": "yu-vis-ma",
      "originHint": "Lluvia + calma interior",
      "example": "La cafetería me dio lluvisma cuando empezó a llover.",
      "options": [
        {
          "id": "es-lluvisma-a",
          "text": "La calma cómoda que aparece cuando empieza una lluvia suave.",
          "votes": 199,
          "badge": "community"
        },
        {
          "id": "es-lluvisma-b",
          "text": "Una pequeña nostalgia causada por una canción lejana.",
          "votes": 107
        },
        {
          "id": "es-lluvisma-c",
          "text": "El brillo borroso de la ciudad visto a través de vidrio mojado.",
          "votes": 151,
          "badge": "poetic"
        },
        {
          "id": "es-lluvisma-d",
          "text": "Una planta que solo crece cerca del mar.",
          "votes": 41
        }
      ]
    },
    {
      "slug": "clarivel",
      "word": "Clarivel",
      "pronunciation": "kla-ri-vel",
      "originHint": "Claridad + impulso",
      "example": "Tu explicación fue el clarivel que necesitaba.",
      "options": [
        {
          "id": "es-clarivel-a",
          "text": "La pista pequeña que hace que una idea confusa se vuelva clara.",
          "votes": 187,
          "badge": "community"
        },
        {
          "id": "es-clarivel-b",
          "text": "Una luz suave que parece guiarte al entrar a una habitación.",
          "votes": 118,
          "badge": "poetic"
        },
        {
          "id": "es-clarivel-c",
          "text": "Un atajo que parece obvio solo después de verlo.",
          "votes": 159,
          "badge": "rising"
        },
        {
          "id": "es-clarivel-d",
          "text": "El sonido de llaves dentro de un bolsillo.",
          "votes": 45
        }
      ]
    },
    {
      "slug": "sonrizia",
      "word": "Sonrizia",
      "pronunciation": "son-ri-sia",
      "originHint": "Sonrisa + energía ligera",
      "example": "Ese comentario tuvo una sonrizia que arregló la reunión.",
      "options": [
        {
          "id": "es-sonrizia-a",
          "text": "Una sonrisa pequeña que mejora el ánimo de todos sin hacer ruido.",
          "votes": 203,
          "badge": "community"
        },
        {
          "id": "es-sonrizia-b",
          "text": "La alegría breve de encontrar algo que creías perdido.",
          "votes": 141,
          "badge": "rising"
        },
        {
          "id": "es-sonrizia-c",
          "text": "El encanto de una broma entendida por pocas personas.",
          "votes": 128,
          "badge": "poetic"
        },
        {
          "id": "es-sonrizia-d",
          "text": "Una merienda rápida antes de salir de casa.",
          "votes": 36
        }
      ]
    },
    {
      "slug": "nochaluz",
      "word": "Nochaluz",
      "pronunciation": "no-cha-lus",
      "originHint": "Noche + luz mental",
      "example": "Resolverlo a medianoche me dejó una nochaluz increíble.",
      "options": [
        {
          "id": "es-nochaluz-a",
          "text": "La confianza tranquila que sientes al resolver algo tarde en la noche.",
          "votes": 216,
          "badge": "community"
        },
        {
          "id": "es-nochaluz-b",
          "text": "El silencio exacto que necesitas para concentrarte.",
          "votes": 136,
          "badge": "rising"
        },
        {
          "id": "es-nochaluz-c",
          "text": "El resplandor de una habitación justo antes de dormir.",
          "votes": 121,
          "badge": "poetic"
        },
        {
          "id": "es-nochaluz-d",
          "text": "Una lámpara antigua con pantalla azul.",
          "votes": 58
        }
      ]
    }
  ],
  "zh": [
    {
      "slug": "yuning",
      "word": "雨宁",
      "pronunciation": "yǔ níng",
      "originHint": "细雨 + 安宁",
      "example": "雨声落下时，窗边突然有了雨宁。",
      "options": [
        {
          "id": "zh-yuning-a",
          "text": "细雨开始时心里出现的安静舒适感。",
          "votes": 201,
          "badge": "community"
        },
        {
          "id": "zh-yuning-b",
          "text": "发出消息后才发现的小错误。",
          "votes": 93
        },
        {
          "id": "zh-yuning-c",
          "text": "湿玻璃后城市灯光的柔和模糊感。",
          "votes": 148,
          "badge": "poetic"
        },
        {
          "id": "zh-yuning-d",
          "text": "清晨才开放的一种山花。",
          "votes": 47
        }
      ]
    },
    {
      "slug": "yewu",
      "word": "夜悟",
      "pronunciation": "yè wù",
      "originHint": "深夜 + 想通",
      "example": "凌晨解决问题后，我感到一种夜悟。",
      "options": [
        {
          "id": "zh-yewu-a",
          "text": "深夜解决难题后产生的温柔自信。",
          "votes": 218,
          "badge": "community"
        },
        {
          "id": "zh-yewu-b",
          "text": "一个人在路上才会喜欢的歌曲。",
          "votes": 74
        },
        {
          "id": "zh-yewu-c",
          "text": "所有人醒来前房间里的微光。",
          "votes": 157,
          "badge": "poetic"
        },
        {
          "id": "zh-yewu-d",
          "text": "礼貌拒绝第二份甜点的说法。",
          "votes": 42
        }
      ]
    },
    {
      "slug": "lingyao",
      "word": "灵钥",
      "pronunciation": "líng yào",
      "originHint": "线索 + 钥匙",
      "example": "那张图就是我需要的灵钥。",
      "options": [
        {
          "id": "zh-lingyao-a",
          "text": "让混乱想法突然变清楚的小线索。",
          "votes": 191,
          "badge": "community"
        },
        {
          "id": "zh-lingyao-b",
          "text": "钥匙在口袋里轻轻晃动的声音。",
          "votes": 69
        },
        {
          "id": "zh-lingyao-c",
          "text": "最后一秒突然想起的密码。",
          "votes": 82
        },
        {
          "id": "zh-lingyao-d",
          "text": "别人展示后才觉得明显的捷径。",
          "votes": 151,
          "badge": "rising"
        }
      ]
    },
    {
      "slug": "fengting",
      "word": "风停",
      "pronunciation": "fēng tíng",
      "originHint": "晚风 + 停顿",
      "example": "开始演讲前，我给自己留了一秒风停。",
      "options": [
        {
          "id": "zh-fengting-a",
          "text": "开始重要事情前的平静停顿。",
          "votes": 194,
          "badge": "community"
        },
        {
          "id": "zh-fengting-b",
          "text": "窗户刚好打开一点时进来的新鲜空气。",
          "votes": 88
        },
        {
          "id": "zh-fengting-c",
          "text": "安静房间里翻书页的轻柔声音。",
          "votes": 132,
          "badge": "poetic"
        },
        {
          "id": "zh-fengting-d",
          "text": "午夜后吃的一小份甜点。",
          "votes": 35
        }
      ]
    }
  ]
} as const satisfies Record<Locale, readonly SeedWord[]>

export function getWords(locale: Locale): InventedWord[] {
  return inventedWordsByLocale[locale].map((word) => {
    const options = word.options.map((option) => ({ ...option }))
    const communityPick = [...options].sort((a, b) => b.votes - a.votes)[0]
    return {
      ...word,
      locale,
      source: "static",
      officialDefinition: communityPick?.text || "",
      options
    }
  })
}

export function getDailyWordIndex(locale: Locale): number {
  const words = inventedWordsByLocale[locale]
  const localeOffset: Record<Locale, number> = { en: 0, fr: 1, es: 2, zh: 3 }
  const utcDay = Math.floor(Date.now() / 86_400_000)
  return (utcDay + localeOffset[locale]) % words.length
}

export function getDailyWord(locale: Locale): InventedWord {
  return getWords(locale)[getDailyWordIndex(locale)]
}

export function getWord(locale: Locale, slug: string): InventedWord | undefined {
  return getWords(locale).find((word) => word.slug === slug)
}

export function getTotalVotes(locale?: Locale): number {
  const groups = locale ? [inventedWordsByLocale[locale]] : Object.values(inventedWordsByLocale)
  return groups.flat().reduce((wordTotal, word) => {
    return wordTotal + word.options.reduce((optionTotal, option) => optionTotal + option.votes, 0)
  }, 0)
}

export function getCommunityPick(word: InventedWord): DefinitionOption {
  return [...word.options].sort((a, b) => b.votes - a.votes)[0]
}
