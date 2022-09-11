import { useState } from "react";
import { Heading, VStack, Icon, useTheme } from "native-base";

import { Envelope, Key } from 'phosphor-react-native';

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false)
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const {colors} = useTheme()

    function handleSignIn(){
        if(!email || !password){
            return Alert.alert("Entrar", "Informe e-mail e senha")
        }
        setIsLoading(false)

        // auth()
        //     .signInWithEmailAndPassword(email, password)
        //     .catch((error) => {
        //         console.log(error)
        //         setIsLoading(false)

        //         if(error.code === 'auth/invalid-email'){
        //             return  Alert.alert("Entrar", "E-mail inválido")
        //         }

        //         if(error.code === 'auth/wrong-password'){
        //             return  Alert.alert("Entrar", "E-mail ou senha inválida")
        //         }

        //         if(error.code === 'auth/user-not-found'){
        //                 return Alert.alert("Entrar", "E-mail ou senha inválida")
        //         }

        //         Alert.alert("Entrar", "Não foi possível acessar")
        //     })
    }

    return ( 
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24} >
            <Heading color="gray.100" fontSize="xl" mt={20} mb={6} >
                Acesse sua conta
            </Heading>
            <Input 
                placeholder="E-mail"
                mb={4} 
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4}/>}
                onChangeText={setEmail}
            />
            <Input 
                mb={8}
                placeholder="Senha" 
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4}/>}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button 
                onPress={handleSignIn}
                title="Entrar" 
                w="full"
                isLoading={isLoading}
            />
        </VStack>
    )
}