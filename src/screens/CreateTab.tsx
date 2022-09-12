import { useState } from "react";
import { Heading, VStack, Icon, useTheme, HStack, IconButton, Checkbox, Text, Pressable, Image } from "native-base";

import { ArrowLeft, GoogleChromeLogo, ListChecks, NumberSquareNine, Scroll, Upload } from 'phosphor-react-native';

import UnsplashSearch, { UnsplashPhoto } from 'react-native-unsplash';

import firestore from '@react-native-firebase/firestore'

import getAuth from "@react-native-firebase/auth"

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

import unsplashKeys from '../credentials/unsplashKeys.json'
import { useNavigation } from "@react-navigation/native";

export function CreateTab(){
    const [isLoading, setIsLoading] = useState(false)

    const [checkReports, setCheckReports] = useState(false)
    const [checkScore, setCheckScore] = useState(false)
    const [checkTasks, setCheckTasks] = useState(false)
    const [checkSite, setCheckSite] = useState(false)

    const [tabName, setTabName] = useState('')

    const [selectPicture, setSelectPicture] = useState(false)
    const [selectedPicture, setSelectedPicture] = useState(null)
    const [selectedOption, setSelectedOption] = useState('')

    const {colors} = useTheme()

    const navigation = useNavigation()

    const user = getAuth()

    function selectedCheckBox(type){
        type === "site" ? setCheckSite(true) : setCheckSite(false)
        type === "reports" ? setCheckReports(true) : setCheckReports(false)
        type === "score" ? setCheckScore(true) : setCheckScore(false)
        type === "tasks" ? setCheckTasks(true) : setCheckTasks(false) 
        
        setSelectedOption(type)
    }

    function onOnlinePhotoSelect(photo: UnsplashPhoto) {
        setSelectedPicture(`${photo.urls.regular}`)
        setSelectPicture(false)
    }

    function handleNewTab(){
        if(!tabName || !selectedPicture || !selectedOption){
          return Alert.alert("Registrar", "Preencha todos os campos.")
        }
    
        setIsLoading(true)
        firestore()
          .collection('tabs')
          .add({
            tabName, 
            imageUrl: selectedPicture,
            userId: user.currentUser.uid,
            type: selectedOption
          })
          .then(() => {
            Alert.alert("Solicitação", "Solicitação registrada com sucesso.")
            navigation.goBack()
          })
          .catch(error => {
            console.log(error)
            setIsLoading(false)
            return Alert.alert("Solicitação", "Não foi possível registrar o pedido")
          })
      }

    return ( 
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={6}
                pb={5}
                px={6}
            >   
                <IconButton
                    icon={<ArrowLeft size={26} color={colors.gray[300]} />}
                    onPress={() => navigation.goBack()}
                />
            </HStack>

            { selectPicture === true ? 
                <UnsplashSearch
                    accessKey={ unsplashKeys.accessKey} 
                    onPhotoSelect={onOnlinePhotoSelect}
                />
             :
            <VStack flex={1} p={6} >
                <Input 
                    placeholder='Nome da aba'
                    onChangeText={setTabName}
                    value={tabName}
                    mt={4} 
                    mb={4}
                />

                <Pressable onPress={() => setSelectPicture(true)} >
                    <HStack
                        bg="gray.700"
                        h={14}
                        mb={5}
                        size="md"
                        borderRadius={5}
                        alignItems="center"
                        justifyContent="center"
                    >

                        {selectedPicture === null ? 
                            <></>
                        :
                            <Image 
                                source={{
                                    uri: selectedPicture
                                }} 
                                w="full"
                                h={55}
                                alt="tabImage"
                                borderRadius={5}
                            />
                        }
                        <HStack 
                            position="absolute" 
                            bg={'rgba(52, 52, 52, 0.8)'} 
                            justifyContent="center"
                            alignItems="center"
                            w="full"
                            h={55}
                        >
                            <Upload size={26} color={colors.gray[300]} />
                            <Text bold ml={2} color={colors.gray[300]} > Escolher Capa </Text>
                        </HStack>

                    </HStack>
                </Pressable>
            
                <Checkbox  
                    mb={5} size="md" 
                    isChecked={checkReports} 
                    onChange={() => selectedCheckBox("reports")}
                    icon={<Icon as={<Scroll size={26} color={colors.white} />} />}
                    value="reports"
                >
                    <Text bold color="gray.200" >Relatórios</Text>
                </Checkbox>

                <Checkbox 
                    mb={5} size="md" 
                    isChecked={checkScore} 
                    onChange={() => selectedCheckBox("score")} 
                    icon={<Icon as={<NumberSquareNine size={26} color={colors.white} />} />}
                    value="score">
                    <Text bold color="gray.200" >Pontuações</Text>
                </Checkbox>

                <Checkbox 
                    mb={5} size="md" 
                    isChecked={checkTasks} 
                    onChange={() => selectedCheckBox("tasks")} 
                    icon={<Icon as={<ListChecks size={26} color={colors.white} />} />}
                    value="tasks">
                    <Text bold color="gray.200" >Tarefas</Text>
                </Checkbox>

                <Checkbox 
                    mb={5} size="md" 
                    isChecked={checkSite} 
                    onChange={() => selectedCheckBox("site")} 
                    icon={<Icon as={<GoogleChromeLogo size={26} color={colors.white} />} />}
                    value="site">
                    <Text bold color="gray.200" >Site</Text>
                </Checkbox>

                <Button onPress={handleNewTab} isLoading={isLoading} mt={3} title="Criar nova aba" />
            </VStack>}
        </VStack>
    )
}