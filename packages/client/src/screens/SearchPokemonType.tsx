import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button } from 'antd';
import { Input } from 'antd';
import * as Pokemon from '../features/pokemon/PokemonByTypeSlice'
import * as AllPokemon from '../features/pokemon/PokemonSlice'

import { Select } from 'antd';

const { Option } = Select;

const SearchPokemon = () => {

    const { Search } = Input;
    const [search, setSearch] = useState("")
    const dataStore = useSelector(Pokemon.pokemonSelector)
    const showMore = useSelector(Pokemon.showMoreSelector)
    const [limit, setLimit] = useState(5)
    const [counterLimit, setCounterLimit] = useState(limit)
    const limitStore = useSelector(Pokemon.limitSelector)
    const searchLastWord = useSelector(Pokemon.searchSelector)
    const dispatch = useDispatch()
    const [data, setData] = useState([])

    const changeValue = (value: string) => {
        setLimit(parseInt(value))
    }


    const searchFunction = (showMore?: boolean) => {

        var limitItem: number
        showMore ? limitItem = counterLimit + limit : limitItem = limit
        dispatch(Pokemon.getPokemon(search, limitItem))
        setCounterLimit(limitItem)
        let element: any = []

        for (let i = 0; i < dataStore.length; i++) {
            element.push(dataStore[i].node)
            element[i] = { ...element[i], image: "https://pokeres.bastionbot.org/images/pokemon/" + parseInt(element[i].id, 10) + ".png" }
        }
        setData(element)
    }


    useEffect(() => {
        reloadData()
    }, [useSelector(Pokemon.pokemonSelector)])

    useEffect(() => {
        dispatch(AllPokemon.getAllPokemon())
    }, [])




    const reloadData = () => {
        setCounterLimit(limitStore)
        setSearch(searchLastWord)
        let element: any = []
        for (let i = 0; i < dataStore.length; i++) {
            element.push(dataStore[i].node)
            element[i] = { ...element[i], image: "https://pokeres.bastionbot.org/images/pokemon/" + parseInt(element[i].id, 10) + ".png" }
        }
        setData(element)
    }

    const columns = [

        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },


        {
            title: 'Classification',
            dataIndex: 'classification',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image: string) => <img style={{ width: "100px", height: "100px" }} alt={image} src={image} />
        },
    ];


    return (
        <div>
            <div>
                <h4>Search pokemon by name</h4>

                <Search
                    placeholder="Search type of pokemon"
                    enterButton="Search"
                    size="large"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={() => searchFunction()}
                />


                <div>Limit result: <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Set limit result"
                    onChange={changeValue}
                    defaultValue="5"

                >
                    <Option value="5" selected={true}>5</Option>
                    <Option value="10">10</Option>
                    <Option value="25">25</Option>
                    <Option value="50">50</Option>
                    <Option value="100">100</Option>
                    <Option value="9999">No limit</Option>

                </Select></div>

                <Table columns={columns} dataSource={data} size="small" pagination={false} />
                {showMore ? <Button title="showMore" onClick={() => searchFunction(true)}> showMore </Button> : null}



            </div>

        </div>
    )
}



export default SearchPokemon