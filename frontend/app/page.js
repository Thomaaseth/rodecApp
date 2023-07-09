"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { Box, Text } from '@chakra-ui/react'
import Layout from '@/components/Layout/Layout'


export default function Home() {
  return (
    <Layout>
      <Box p={4}>
        <Text fontSize="xl">Welcome to Home Page!</Text>
      </Box>
    </Layout>
  )
}
