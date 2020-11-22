import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'antd';
import * as Pokemon from '../features/pokemon/PokemonSlice'

const AllPokemon = () => {
    const dispatch = useDispatch()
    const dataStore = useSelector(Pokemon.pokemonSelector)

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

    function Search(): any {
        let element = []
        for (let i = 0; i < dataStore.length; i++) {
            element.push(dataStore[i].node)
            element[i] = { ...element[i], image: "https://pokeres.bastionbot.org/images/pokemon/" + parseInt(element[i].id, 10) + ".png" }
        }
        return element
    }

    useEffect(() => {
        dispatch(Pokemon.getAllPokemon())
    }, [dispatch]);

    return (
        <>

            <div>
                <div>
                    <h4>All Pokemon with pagination of default Antd Table</h4>

                    <Table columns={columns} dataSource={Search()} size="small" />
                </div>,
        </div>

        </>
    )

}



export default AllPokemon
