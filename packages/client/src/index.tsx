// @ts-ignore

import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { configureStore, Action } from "@reduxjs/toolkit"
import pokemonSliceReducer from "./features/pokemon/PokemonSlice"
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { ThunkAction } from "redux-thunk"
import { pokemonState } from "./features/pokemon/PokemonSlice"
import Menu from "./containers/Menu"
import pokemonByNameSlice from "./features/pokemon/PokemonByNameSlice"
import pokemonByTypeSlice from "./features/pokemon/PokemonByTypeSlice"
import pokemonFullSearch from "./features/pokemon/PokemonFullSearchSlice"

// The AppThunk type will help us in writing type definitions for thunk actions
export type AppThunk = ThunkAction<void, pokemonState, unknown, Action<string>>;

const store: any = configureStore({
  reducer: {
    // the convention is to name this photos rather than photosStore but photosStore is clearer to me.
    pokemonState: pokemonSliceReducer,
    pokemonByName: pokemonByNameSlice,
    pokemonByType: pokemonByTypeSlice,
    pokemonFullSearch: pokemonFullSearch

    // anyOtherStore: anyOtherSlice,
    // middleware: ['array of middlewares'],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Menu />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
