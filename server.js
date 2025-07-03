const express = require('express');
const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzerModule = require('kuroshiro-analyzer-kuromoji');
const cors = require('cors');

const KuromojiAnalyzer = KuromojiAnalyzerModule.default || KuromojiAnalyzerModule;

const app = express();
app.use(cors());
app.use(express.json());

let kuroshiro;

// 初始化 Kuroshiro
(async () => {
  kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());
  console.log('Kuroshiro ready');
})();

app.post('/api/romaji', async (req, res) => {
  const { text, to } = req.body;
  if (!kuroshiro) {
    return res.status(503).json({ error: 'Kuroshiro not ready' });
  }
  try {
    if (to === 'hiragana') {
      const hira = await kuroshiro.convert(text, { to: 'hiragana', mode: 'spaced' });
      res.json({ hiragana: hira });
    } else {
      const result = await kuroshiro.convert(text, {
        to: 'romaji',
        mode: 'spaced',
        romajiSystem: 'hepburn'
      });
      res.json({ romaji: result });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 