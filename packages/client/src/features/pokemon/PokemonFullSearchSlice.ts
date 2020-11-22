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
    searchType: string[],
    searchName: string
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
    data: { hasNextPage: false, endCursor: "001", limit: 10, searchType: [], searchName: '' },

}

const pokemonFullSearch = createSlice({
    name: "pokemonFullSearch",
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
            state.data.searchName = payload.searchName

        }
    }
})


export const { setLoading, setErrors, setPokemon, setLimit } = pokemonFullSearch.actions
export default pokemonFullSearch.reducer


export const getPokemon = (type: string, limit: number, q: string, after?: string): AppThunk => {
    return async dispatch => {
        dispatch(setLoading(true))
        const query = gql`
        query pokemonFullSearch($types:String!,$q:String!,$limit:Int!)
            {
                pokemonFullSearch(types:$types,q:$q,limit:$limit)
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
                    types: type.toString(),
                    limit: limit,
                    after: after,
                    q: q
                }
            })
            .then((result: any) => {

                dispatch(setLimit({ ...result.data.pokemonFullSearch.pageInfo, limit: limit, searchType: type, searchName: q }))
                dispatch(setLoading(false))
                dispatch(setPokemon(result.data.pokemonFullSearch.edges))


            })


            .catch((error) => {
                dispatch(setErrors(error))
                dispatch(setLoading(false))
            })
    }
}

export const pokemonSelector = ((state: any) => state.pokemonFullSearch.pokemon)
export const loadingSelector = ((state: any) => state.pokemonFullSearch.loading)
export const showMoreSelector = ((state: any) => state.pokemonFullSearch.data.hasNextPage)
export const limitSelector = ((state: any) => state.pokemonFullSearch.data.limit)
export const searchTypeSelector = ((state: any) => state.pokemonFullSearch.data.searchType)
export const searchNameSelector = ((state: any) => state.pokemonFullSearch.data.searchName)


