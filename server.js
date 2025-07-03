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

app.post('/api/furigana', async (req, res) => {
  const { text, to } = req.body;
  if (!kuroshiro) {
    return res.status(503).json({ error: 'Kuroshiro not ready' });
  }
  try {
    // 使用Kuroshiro的tokenize方法获取分词和注音
    const tokens = await kuroshiro._analyzer.tokenize(text);
    const result = await Promise.all(tokens.map(async token => {
      const surface = token.surface_form;
      // ひらがな
      const reading = await kuroshiro.convert(surface, { to: 'hiragana', mode: 'normal' });
      // 罗马字
      const romaji = await kuroshiro.convert(surface, { to: 'romaji', mode: 'normal', romajiSystem: 'hepburn' });
      return { surface, reading, romaji };
    }));
    if (to === 'romaji') {
      res.json({ result, display: result.map(t => t.romaji).join(' ') });
    } else {
      res.json({ result, display: result.map(t => t.reading).join(' ') });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 