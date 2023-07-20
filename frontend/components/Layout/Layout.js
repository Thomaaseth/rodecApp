"use client"
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import { Flex } from '@chakra-ui/react'

const Layout = ({ children }) => {
    return (
        <Flex
            direction="column"
            h="100vh"
            justifyContent="space-between"
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