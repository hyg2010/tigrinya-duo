// data/levels.js

export const LEVELS = [
  {
    id: 1,
    title: 'Greetings',
    words: [
      // How are you? (M) — suffix cloze
      {
  ti: 'ከመይ ኣለኻ?',
  latin: 'kemey ālekā',
  en: 'How are you? (M)',
  type: 'suffixCloze',
  cloze: {
    // we'll render the blank where "____" is
    promptTi: 'kemey alä____ ? (M)',
    options: ['-ka', '-ki', 'selam', 'deHan'],
    correct: '-ka',
    hint: '-ka = you (M), -ki = you (F)',
  },
},

      // How are you? (F) — suffix cloze
      {
  ti: 'ከመይ ኣለኺ?',
  latin: 'kemey ālekī',
  en: 'How are you? (F)',
  type: 'suffixCloze',
  cloze: {
    promptTi: 'kemey alä____ ? (F)',
    options: ['-ka', '-ki', 'selam', 'deHan'],
    correct: '-ki',
    hint: '-ki = you (F), -ka = you (M)',
  },
},

      { ti: 'ከመይ ሓዲርካ?', latin: 'kemey Hadirka', en: 'Good morning (M)' },
      { ti: 'ከመይ ሓዲርኪ?', latin: 'kemey Hadirki', en: 'Good morning (F)' },
      { ti: 'ከመይ ኣምሲኻ?', latin: 'kemey amsika', en: 'Good Evening (M)' },
      { ti: 'ከመይ ኣምሲኺ?', latin: 'kemey amsiki', en: 'Good Evening (F)' },
      { ti: 'ቡሩኽ ለይቲ', latin: 'Buruk Leyti', en: 'Good Night' },
      { ti: 'ደሓን ውዕል', latin: 'deHan we alu', en: 'Have a nice day' },
      { ti: 'ከመይ ውዒልካ?', latin: 'kemey weīlka?', en: 'How was your day? (M)' },
      { ti: 'ከመይ ውዒልኪ?', latin: 'kemey weīlki?', en: 'How was your day? (F)' },
    ],
  },
  {
    id: 2,
    title: 'Common Responses',
    words: [
      { ti: 'ስራሕ ኣለኒ', latin: 'srah aleni', en: 'I am busy or i have work' },
      { ti: 'ይሰትየ ኣለኹ', latin: 'ysety alekhu', en: 'I am drinking' },
      { ti: 'ኣቤል ይበሃል', latin: 'abel ibehal', en: 'My name is Abel' },
      { ti: 'ኣይከኣልን', latin: 'aykealn', en: 'it is not possible' },
      { ti: 'ደሓን እየ', latin: 'dahan eya', en: "I'm fine" },
      { ti: 'እንታይ ሓዲስ ነገር', latin: 'enetay hades nagar', en: "What's new" },
      { ti: 'ጽቡቕ ለይቲ', latin: 'Tsubu leyla', en: 'Nice to meet you' },
    ],
  },
  {
    id: 3,
    title: 'Introductions',
    words: [
      { ti: 'መን ሽምካ?', latin: 'Men shmka', en: 'What is your name? (M)' },
      { ti: 'መን ሽምኪ?', latin: 'Men shmki', en: 'What is your name? (F)' },
      { ti: 'ሽመይ ቤቲ ይበሃል', latin: 'Shmay Betty iyu', en: 'My name is Betty' },
      { ti: 'ኣበይ ኣድኻ?', latin: 'abey adkha?', en: 'Where are you from? (M)' },
      { ti: 'ኣበይ ኣድኺ?', latin: 'abey adkhi?', en: 'Where are you from? (F)' },
    ],
  },
];
