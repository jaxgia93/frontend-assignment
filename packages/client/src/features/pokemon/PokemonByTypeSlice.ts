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
    searchType: string
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
    data: { hasNextPage: false, endCursor: "001", limit: 10, searchType: "" },

}

const pokemonByType = createSlice({
    name: "pokemonByType",
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
            state.data.searchType = payload.searchType
        }
    }
})


export const { setLoading, setErrors, setPokemon, setLimit } = pokemonByType.actions
export default pokemonByType.reducer


export const getPokemon = (type: string, limit: number, after?: string): AppThunk => {
    return async dispatch => {
        dispatch(setLoading(true))
        const query = gql`
        query pokemonsByType($limit:Int,$type:String!) 
            {
                pokemonsByType(type:$type,limit:$limit)
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
                    type: type,
                    limit: limit,
                    after: after
                }
            })
            .then((result: any) => {

                dispatch(setLimit({ ...result.data.pokemonsByType.pageInfo, limit: limit, searchType: type }))
                dispatch(setLoading(false))
                dispatch(setPokemon(result.data.pokemonsByType.edges))


            })


            .catch((error) => {
                dispatch(setErrors(error))
                dispatch(setLoading(false))
            })
    }
}

export const pokemonSelector = ((state: any) => state.pokemonByType.pokemon)

export const loadingSelector = ((state: any) => state.pokemonByType.loading)
export const showMoreSelector = ((state: any) => state.pokemonByType.data.hasNextPage)
export const limitSelector = ((state: any) => state.pokemonByType.data.limit)
export const searchSelector = ((state: any) => state.pokemonByType.data.searchType)


