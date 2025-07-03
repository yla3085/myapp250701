import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState([]); // [{surface, reading, romaji}]
  const [displayType, setDisplayType] = useState('hiragana'); // 'hiragana' | 'romaji'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConvert = async () => {
      if (input.trim() === '') {
        setResult([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:3001/api/furigana', { text: input, to: displayType === 'romaji' ? 'romaji' : 'hiragana' });
        setResult(res.data.result || []);
      } catch (e) {
        setResult([]);
      }
      setLoading(false);
    };
    fetchConvert();
  }, [input, displayType]);

  return (
    <div style={{ maxWidth: 600, margin: '48px auto', fontFamily: 'Segoe UI,Roboto,Helvetica Neue,sans-serif', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0001', padding: '40px 32px' }}>
      <h1 style={{ fontWeight: 700, fontSize: 28, color: '#223', marginBottom: 24, letterSpacing: 1 }}>日文汉字假名标注工具</h1>
      <p style={{ color: '#666', fontSize: 16, marginBottom: 24 }}>输入日文文本，自动显示每个词的假名或罗马字读音。适合日语学习、商务场景。</p>
      <textarea
        rows={5}
        style={{ width: '100%', fontSize: 18, padding: 12, borderRadius: 8, border: '1px solid #d0d6e1', background: '#f8fafc', marginBottom: 24, resize: 'vertical' }}
        placeholder="请输入日文单词或段落..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setDisplayType('hiragana')}
          style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', background: displayType === 'hiragana' ? '#2a5fff' : '#e6eaf3', color: displayType === 'hiragana' ? '#fff' : '#223', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'all .2s' }}
        >
          ひらがな显示
        </button>
        <button
          onClick={() => setDisplayType('romaji')}
          style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', background: displayType === 'romaji' ? '#2a5fff' : '#e6eaf3', color: displayType === 'romaji' ? '#fff' : '#223', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'all .2s' }}
        >
          罗马字显示
        </button>
      </div>
      <div style={{ minHeight: 48, background: '#f4f6fa', borderRadius: 8, padding: 18, fontSize: 20, color: '#223', boxShadow: '0 1px 2px #0001', border: '1px solid #e0e4ef', marginBottom: 8 }}>
        {loading && <span style={{ color: '#888', fontSize: 16 }}>正在分析...</span>}
        {!loading && result.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {result.map((t, i) => (
              <span key={i} style={{ display: 'inline-block', padding: '0 6px', borderRadius: 4, background: '#fff', boxShadow: '0 1px 2px #0001', border: '1px solid #e0e4ef', minWidth: 24, textAlign: 'center' }}>
                <span style={{ fontSize: 15, color: '#2a5fff', fontWeight: 500, display: 'block', marginBottom: 2 }}>{displayType === 'hiragana' ? t.reading : t.romaji}</span>
                <span style={{ fontSize: 20, color: '#223', fontWeight: 600 }}>{t.surface}</span>
              </span>
            ))}
          </div>
        )}
        {!loading && result.length === 0 && <span style={{ color: '#aaa', fontSize: 16 }}>结果将在此处显示</span>}
      </div>
      <div style={{ textAlign: 'right', color: '#b0b4c0', fontSize: 13, marginTop: 16 }}>Powered by Kuroshiro.js + Kuromoji | Designed for Japanese learners</div>
    </div>
  );
}