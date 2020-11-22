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

export interface pageInfo {
    endCursor: string,
    hasNextPage: boolean,
    limit: number,
    searchQuery: string
}

export interface pokemonState {
    pokemon: Pokemon[];
    loading: boolean;
    errors: string;
    data: pageInfo
}

const initialState: pokemonState = {
    pokemon: [],
    loading: false,
    errors: "",
    data: { hasNextPage: false, endCursor: "001", limit: 5, searchQuery: "" },

}

const pokemonByName = createSlice({
    name: "pokemonByName",
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

        setLimit: (state, { payload }: PayloadAction<any>) => {
            state.data.endCursor = payload.endCursor
            state.data.hasNextPage = payload.hasNextPage
            state.data.limit = payload.limit
            state.data.searchQuery = payload.searchQuery
        }
    }
})


export const { setLoading, setErrors, setPokemon, setLimit } = pokemonByName.actions
export default pokemonByName.reducer

export const getPokemon = (q: string, limit?: number, after?: string): AppThunk => {
    return async dispatch => {
        dispatch(setLoading(true))
        const query = gql`
        query pokemon($q: String,$limit:Int) 
            {
                pokemons(q:$q,limit:$limit)
                 {
                  edges{
                    node{
                      id,name,classification
                    }
                  },
                  pageInfo{
                    endCursor,
                    hasNextPage
                  }
                  }
                }`;

        client
            .query({
                query: query,
                variables: {
                    q: q,
                    limit: limit,

                }
            })
            .then((result: any) => {
                dispatch(setLoading(false))
                dispatch(setPokemon(result.data.pokemons.edges))
                dispatch(setLimit({ ...result.data.pokemons.pageInfo, limit: limit, searchQuery: q }))
            })

            .catch((error) => {
                dispatch(setErrors(error))
                dispatch(setLoading(false))
            })
    }
}

export const pokemonSelector = ((state: any) => state.pokemonByName.pokemon)
export const loadingSelector = ((state: any) => state.pokemonByName.loading)
export const showMoreSelector = ((state: any) => state.pokemonByName.data.hasNextPage)
export const limitSelector = ((state: any) => state.pokemonByName.data.limit)
export const searchSelector = ((state: any) => state.pokemonByName.data.searchQuery)


