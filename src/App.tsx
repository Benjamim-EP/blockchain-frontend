import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import AddBlock from './components/AddBlock';
import BlockCanvas from './components/BlockCanvas';
import tempBlocks from './data/temp_blocks.json';
import './App.css'; // Adicione o CSS

type Block = {
  index: number;
  data: string;
  previous_hash: string;
  hash: string;
  nonce: number;
};

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const fetchBlocks = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeout = setTimeout(() => {
      controller.abort();
    }, 5000); // 5 segundos para timeout

    try {
      const response = await fetch('https://blockchain-api-dtdz.onrender.com/blockchain/blocks', { signal });
      clearTimeout(timeout);
      if (response.ok) {
        const data = await response.json();
        setBlocks(data);
        setIsConnected(true);
      } else {
        throw new Error('Erro ao buscar os blocos');
      }
    } catch (error) {
      setBlocks(tempBlocks); // Carrega os blocos do arquivo local
      setIsConnected(false); // Indica que não conseguiu conectar
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  return (
    <div className="App">
      <Hero />
      <div className="server-status">
        <span className={isConnected ? 'status connected' : 'status disconnected'}>
          Servidor backend
        </span>
      </div>
      <AddBlock onBlockAdded={fetchBlocks} /> {/* Passa a função fetchBlocks */}
      <BlockCanvas blocks={blocks} />
    </div>
  );
};

export default App;
