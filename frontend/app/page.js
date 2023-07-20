"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { Box, Text } from '@chakra-ui/react'


export default function Home() {
  return (
    <Box p={4}>
      <Text fontSize="xl">Welcome to Home Page!</Text>
    </Box>
  )
}
