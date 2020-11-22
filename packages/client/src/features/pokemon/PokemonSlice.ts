import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import client from '../../api'
import { AppThunk } from "../../index"
import { gql } from '@apollo/client';

export interface Pokemon {
    id: string;
    name: string;
    types: string[];
    classification: string
}

export interface pokemonState {
    pokemon: Pokemon[];
    loading: boolean;
    errors: string;
    types: String[]
}

const initialState: pokemonState = {
    pokemon: [],
    loading: false,
    errors: "",
    types: []
}

const pokemonSlice = createSlice({
    name: "pokemon",
    initialState,
    reducers: {
        setLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.loading = payload
        },

        setErrors: (state, { payload }: PayloadAction<string>) => {
            state.errors = payload
        },

        setPokemon: (state, { payload }: PayloadAction<Pokemon[]>) => {
            state.pokemon = payload
        },
        setTypes: (state, { payload }: PayloadAction<String[]>) => {
            state.types = payload
        }
    }
})


export const { setLoading, setErrors, setPokemon, setTypes } = pokemonSlice.actions

export default pokemonSlice.reducer



export const getAllPokemon = (): AppThunk => {
    return async dispatch => {
        dispatch(setLoading(true))
        const query = gql`
       {
            pokemons(limit:200){
                edges{
                    node{
                    name,
                    id,
                    types,
                    classification
                    }
            }
        }
        }`;

        client
            .query({
                query: query,
            })
            .then((result: any) => {
                dispatch(setLoading(false))
                dispatch(setPokemon(result.data.pokemons.edges))
                const TypePokemon = ReturnType(result.data.pokemons.edges)

                dispatch(setTypes(TypePokemon))
            })
            .catch((error) => {
                dispatch(setErrors(error))
                dispatch(setLoading(false))
            })
    }
}

function ReturnType(arr: any[]): any {
    var typeUnique: any[] = []
    var i = 0
    var j = 0

    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr[i].node.types.length; j++)

            if (!(typeUnique.includes(arr[i].node.types[0]))) {
                typeUnique.push(arr[i].node.types[0])
            }
    }
    return (typeUnique.sort((a, b) => a.localeCompare(b)))
}


export const getPokemon = (q: string): AppThunk => {
    return async dispatch => {
        dispatch(setLoading(true))
        const query = gql`
        query pokemon($q: String) {
            pokemons(q: $q,limit:9999){
                edges{
                    node{
                    name,
                    id,
                    types,
                    classification
                    }
            }
        }
        }`;

        client
            .query({
                query: query,
                variables: {
                    q: q
                }
            })
            .then((result: any) => {
                dispatch(setLoading(false))
                dispatch(setPokemon(result.data.pokemons.edges))

            })

            .catch((error) => {
                dispatch(setErrors(error))
                dispatch(setLoading(false))
            })
    }
}

export const pokemonSelector = ((state: any) => state.pokemonState.pokemon)
export const loadingSelector = ((state: any) => state.pokemonState.loading)
export const pokemonByNameSelector = ((state: any) => state.pokemonState.pokemonByName)
export const pokemonTypeSelector = ((state: any) => state.pokemonState.types)

