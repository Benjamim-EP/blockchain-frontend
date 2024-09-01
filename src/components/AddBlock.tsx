import React, { useState } from 'react';

type AddBlockProps = {
  onBlockAdded: () => void;
};

const AddBlock: React.FC<AddBlockProps> = ({ onBlockAdded }) => {
  const [data, setData] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = 'https://blockchain-api-dtdz.onrender.com/blockchain/';
    const body = { data };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onBlockAdded(); // Notifica o componente pai que um novo bloco foi adicionado
        setData(''); // Limpa o campo de entrada
      } else {
        console.error('Erro ao adicionar o bloco');
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Dados do novo bloco"
      />
      <button type="submit">Adicionar Bloco</button>
    </form>
  );
};

export default AddBlock;
