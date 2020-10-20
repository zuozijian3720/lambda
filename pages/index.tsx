import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Lambda</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            lambda
        </div>
    )
}
