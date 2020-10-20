import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Main} from "../src";
import {Provider} from "react-redux";
import {store} from "../src/store";

export default function Home() {
    return (
        <Provider store={store}>
            <div className={styles.container}>
                <Head>
                    <title>Lambda</title>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <Main></Main>
            </div>
        </Provider>
    )
}
