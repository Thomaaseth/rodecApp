"use client"
import Footer from '../Footer/Footer'
import { Flex } from '@chakra-ui/react'
import Navbar from '../Navbar/Navbar'

const Layout = ({ children }) => {
    return (
        <Flex
            direction="column"
            h="100vh"
            justifyContent="center"
        >
            <Navbar />
            <Flex
                grow="1"
                p="2rem"
            >
                {children}
            </Flex>
            <Footer />
        </Flex>
    )
}

export default Layout