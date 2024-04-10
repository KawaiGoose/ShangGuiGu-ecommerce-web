'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 注意：这里是 'next/router'，不是 'next/navigation'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const PokemonSearch = () => {
  const [inputId, setInputId] = useState('');
  const router = useRouter();

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <TextField 
        type="number"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        placeholder="Enter Pokémon ID"
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={() => router.push(`/pokemonreview/${inputId}`)}>
        Search
      </Button>
    </Box>
  );
};

export default PokemonSearch;

