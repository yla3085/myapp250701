import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [input, setInput] = useState('');
  const [romaji, setRomaji] = useState('');
  const [hiragana, setHiragana] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConvert = async () => {
      if (input.trim() === '') {
        setRomaji('');
        setHiragana('');
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:3001/api/romaji', { text: input });
        setRomaji(res.data.romaji);
        // 追加请求ひらかな
        const hiraRes = await axios.post('http://localhost:3001/api/romaji', { text: input, to: 'hiragana' });
        setHiragana(hiraRes.data.hiragana || '');
      } catch (e) {
        setRomaji('转换失败，请检查后端服务');
        setHiragana('');
      }
      setLoading(false);
    };
    fetchConvert();
  }, [input]);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>日文/假名/汉字/英文整体罗马字标注</h2>
      <textarea
        rows={6}
        style={{ width: '100%', fontSize: 18, padding: 8 }}
        placeholder="请输入日语文本"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div style={{ marginTop: 24, minHeight: 32, fontSize: 18 }}>
        {loading && <span style={{ color: 'gray', fontSize: 16 }}>转换中...</span>}
        {!loading && romaji && <div style={{ color: 'red' }}>{romaji}</div>}
        {!loading && hiragana && <div style={{ color: 'blue', marginTop: 8 }}>{hiragana}</div>}
      </div>
    </div>
  );
}