"use client"
import React from 'react';
import RootLayout from '../app/layout';

// This function will be called for every different page that's visited
function MyApp({ Component, pageProps }) {
    return (
        <RootLayout>
            <Component {...pageProps} />
        </RootLayout>
    )
}

export default MyApp;
