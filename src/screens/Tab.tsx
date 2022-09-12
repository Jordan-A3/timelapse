import { useEffect, useState } from "react";
import { Heading, VStack, Icon, useTheme, HStack, IconButton, Image, FlatList } from "native-base";

import { ArrowLeft, CalendarPlus, Envelope, Key } from 'phosphor-react-native';
import { useNavigation, useRoute } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore"
import { Task, TaskProps } from "../components/Task";

type RouteParams = {
    tabId: string;
    tabImage: string;
    userId: string;
    tabName: string;
  }

export function Tab(){
    const navigation = useNavigation()

    const route = useRoute()
    const { tabId, tabImage, userId, tabName } = route.params as RouteParams;

    const [events, setEvents] = useState<TaskProps[]>([
        {
            id: "3",
            type: "tasks",
            title: "Arrumar casa",
            weekday: "sabado",
            userId: userId,
            when: "7/8"
        }
    ])

    const {colors} = useTheme()

    

    // useEffect(() => {
    //     const subscriber = firestore()
    //     .collection('tabs')
    //     .where('userId', '==', userId) 
    //     .onSnapshot(snapshot => {
    //         const data = snapshot.docs.map(doc => {
    //             const { tabName, imageUrl, userId, type } = doc.data();

    //             return {
    //                 id: doc.id,
    //                 userId,
    //                 tabName,
    //                 type,
    //                 imageUrl 
    //             }
    //         })

    //         const allTabs = [...data, {
    //             id: "10",
    //             userId: "allUsers",
    //             tabName: "Create",
    //             type: "universal",
    //             imageUrl: "https://s2.glbimg.com/nIqfLY3zjr8JntK_zMS9QxXFaZk=/e.glbimg.com/og/ed/f/original/2020/09/05/alfons-morales-ylswjsy7stw-unsplash.jpg",
    //             first: 'yes',
    //         }]

    //         setTabs(allTabs)
    //     })

    return ( 
        <VStack flex={1} pb={6} bg="gray.700" >
            <HStack
                w="full"
                justifyContent="center"
                alignItems="center"
                bg="gray.600"
                mb={5}
            >   
                <Image 
                    source={{
                        uri: tabImage
                    }} 
                    w="full"
                    h={90}
                    alt="tabImage"
                />
                <HStack 
                    bg={'rgba(52, 52, 52, 0.8)'}
                    justifyContent="space-evenly"
                    alignItems="center"
                    w="full"
                    h={90}
                    position="absolute"
                >
                    <IconButton
                        icon={<ArrowLeft size={26} color={colors.white} />}
                        onPress={() => navigation.goBack()}
                    />    
                    <Heading color="gray.100" >{tabName.toUpperCase()}</Heading>
                    <IconButton
                        icon={<CalendarPlus size={26} color={colors.gray[300]} />}
                        
                    />
                </HStack>
            </HStack>

            <VStack flex={1} px={6}>
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <Task data={item} />}
                    showsVerticalScrollIndicator={false}
                />
            </VStack>

            
        </VStack>
    )
}