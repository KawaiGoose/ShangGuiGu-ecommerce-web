"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PokemonViewer = () => {
  const router = useRouter();
  const {id} = router.query; // 获取查询参数
  const [pokemon, setPokemon] = useState(null);

  const loadDataFromServer = async () => {
    if (!id) return;

    const api = `https://pokeapi.co/api/v2/pokemon/${id}`;
    try {
      const response = await fetch(api);
      const data = await response.json();
      
      if (data) {
        // 直接从data对象获取name, height, weight
        const pokemonName = data.name;
        const pokemonHeight = data.height; // 假设为以厘米或米为单位的数值
        const pokemonWeight = data.weight; // 假设为以克或千克为单位的数值
      
        // 更新状态，将这些值放入pokemon状态中
        setPokemon({
          index: data.id,
          name: pokemonName,
          height: pokemonHeight,
          weight: pokemonWeight,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
        });
      }
      
    } catch (error) {
      console.error('Error fetching data: ', error);
      setPokemon(null);
    }
  };

  useEffect(() => {
    loadDataFromServer();
  }, [id]); // 依赖数组，当id变化时，重新获取数据

  // 渲染逻辑
  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bitch found a Pokémon</h1>
      {pokemon ? (
        <ul style={{ listStyleType: 'none' }}>
          <li key={pokemon.index}>
            Name: {pokemon.name} <br />
            Height: {pokemon.height} decimetres <br />
            Weight: {pokemon.weight} hectograms <br />
            <img src={pokemon.imageUrl} alt={pokemon.name} height={300} width={300}/>
          </li>
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
  
};

export default PokemonViewer;
