import { useState } from 'react';
import React from 'react'
import Logo from "../assets/image/logo.png"
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import AllPokemon from '../screens/AllPokemon'
import SearchPokemon from '../screens/SearchPokemonName'
import SearchPokemonType from '../screens/SearchPokemonType'
import SearchPokemonTypeSelect from '../screens/SearchPokemonTypeSelect'
import { Footer } from 'antd/lib/layout/layout';

const App = () => {
    const { Content, Sider } = Layout;
    const Page = [AllPokemon, SearchPokemon, SearchPokemonType, SearchPokemonTypeSelect]
    const [selectedPage, setSelectedPage] = useState(0)

    return (
        <>
            <Layout style={{ height: "100vh" }}>

                <Sider trigger={null} collapsible >
                    <img src={Logo} style={{ width: "200px" }} className="logo" alt="Satispay challenge" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<UserOutlined />} onClick={() => setSelectedPage(0)}>
                            All Pokemon
                         </Menu.Item>
                        <Menu.Item key="2" icon={<VideoCameraOutlined />} onClick={() => setSelectedPage(1)}>
                            Search Name
              </Menu.Item>
                        <Menu.Item key="3" icon={<UploadOutlined />} onClick={() => setSelectedPage(2)}>
                            Search Type
            </Menu.Item>
                        <Menu.Item key="4" icon={<UploadOutlined />} onClick={() => setSelectedPage(3)}>
                            Search Type Select
            </Menu.Item>

                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        {React.createElement(Page[selectedPage])}

                    </Content>
                    <Footer>
                        <div>
                            <span>
                                Challenge Satyspay -- Rosa Giacomo
                            </span>
                        </div>
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
}

export default App