"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { Box, Text, VStack, Heading, Button } from '@chakra-ui/react'
import Link from 'next/link'


export default function Home() {
  return (
    <VStack spacing={8} align="center" m={8}>
      <Box p={4} shadow="md" borderWidth="1px" borderRadius="md">
        <Heading as="h2" size="xl">
          Bienvenue sur RoDec !
        </Heading>
      </Box>
      <Box w="75%" textAlign="center">
        <Text fontSize="lg">
          Votre plateforme décentralisée de financement participatif pour les actions humanitaires. Grâce à notre application basée sur la blockchain, vous pouvez contribuer de manière transparente et sécurisée à des initiatives qui font une véritable différence dans le monde.
        </Text>
      </Box>
      <Link href="/donate">
        <Button bg="yellow.400" color="black" size="lg">
          Faites un don aujourd'hui et aidez-nous à construire un avenir meilleur !
        </Button>
      </Link>
    </VStack>
  )
}
