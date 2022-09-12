import { useEffect, useState } from 'react';

import { Button, FlatList, FormControl, Heading, HStack, IconButton, Image, Modal, Text, useTheme, VStack } from 'native-base';
import { SignOut, CalendarPlus } from 'phosphor-react-native'
import { Alert } from 'react-native';

import { Filter } from '../components/Filter';
import { TabComponent, TabProps } from '../components/TabComponent';
import { Task, TaskProps } from '../components/Task';

import auth from '@react-native-firebase/auth'
import getAuth from "@react-native-firebase/auth"

import firestore from "@react-native-firebase/firestore"
import { useNavigation } from '@react-navigation/native';

import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Input } from '../components/Input';

export function Home() {
    const [userId, setUserId] = useState('')

    const [statusSelected, setStatusSelected] = useState<'tasks' | 'events'>('tasks')
    const [tabs, setTabs] = useState<TabProps[]>([])

    const [counterLoadTabs, setCounterLoadTabs] = useState(0)
    const [onLoadTabs, setOnLoadTabs] = useState("load")

    const [counterLoadTasks, setCounterLoadTasks] = useState(0)
    const [onLoadTasks, setOnLoadTasks] = useState("load")

    const date = new Date()
    const navigation = useNavigation()

    const user = getAuth()

    const week = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    const [day, setDay] = useState(week[date.getDay()]);

    const [tasks, setTasks] = useState<TaskProps[]>([])

    const {colors} = useTheme()

    useEffect(() => {
        const subscriber = firestore()
        .collection('tasks')
        .where('userId', '==', userId) 
        .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => {
                const { title, weekday, when, userId, type } = doc.data();

                return {
                    id: doc.id,
                    userId,
                    title,
                    type,
                    weekday,
                    when
                }
            })
            function dailyTask(value) {
                return value.weekday == day
            }

            const allTasks = data.filter(dailyTask)

            const update = () => {
                setTasks(allTasks) 
                setOnLoadTasks("false")
            }

            setCounterLoadTasks(counterLoadTasks + 1)

            data.length !== 0 || counterLoadTasks >= 1 ? update() : setOnLoadTasks("reload");
        })

        return subscriber
    }, [onLoadTasks])

    useEffect(() => {
        const subscriber = firestore()
        .collection('tabs')
        .where('userId', '==', userId) 
        .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => {
                const { tabName, imageUrl, userId, type } = doc.data();

                return {
                    id: doc.id,
                    userId,
                    tabName,
                    type,
                    imageUrl 
                }
            })

            const allTabs = [...data, {
                id: "10",
                userId: "allUsers",
                tabName: "Create",
                type: "universal"
            }]

            const update = () => {
                setTabs(allTabs) 
                setOnLoadTabs("false")
            }

            setCounterLoadTabs(counterLoadTabs + 1)

            data.length !== 0 || counterLoadTabs >= 1 ? update() : setOnLoadTabs("reload");
        })

        setUserId(user.currentUser.uid)

        return subscriber
    }, [onLoadTabs])

    function handleLogOut(){
        auth()
            .signOut()
            .catch(error => {
                console.log(error)
                Alert.alert("Sair", "Não foi possível sair.")
            })
    }

    function createNewRoutine(){
        navigation.navigate('routine' as never, {userId} as never)
    }

    return (
        <VStack flex={1} pb={6} bg="gray.700" >
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
                    icon={<CalendarPlus size={26} color={colors.gray[300]} />}
                    onPress={createNewRoutine}
                />
                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                    onPress={handleLogOut}
                />
            </HStack>

            

            <VStack flex={1} px={6}>
                { onLoadTabs === "loading" || onLoadTabs === "reload" ? 
                    <SkeletonPlaceholder backgroundColor='#E1E9EE' highlightColor={colors.blue[700]} speed={900} direction="right" >
                        <SkeletonPlaceholder.Item marginBottom={20} marginTop={20} flexDirection="row" alignItems="center">
                            <SkeletonPlaceholder.Item marginRight={5} width={100} height={100} borderRadius={5} />
                            <SkeletonPlaceholder.Item marginRight={5} width={100} height={100} borderRadius={5} />
                            <SkeletonPlaceholder.Item marginRight={5} width={100} height={100} borderRadius={5} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                :
                    <HStack mt={8} justifyContent="space-between" alignItems="center">   
                        <FlatList
                            horizontal
                            data={tabs}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => 
                                <TabComponent 
                                    onPress={() => {
                                        item.type === "universal" ? 
                                        navigation.navigate('createtab' as never) : 
                                        navigation.navigate('tab' as never, {
                                            tabId: item.id, 
                                            tabImage: item.imageUrl, 
                                            userId: item.userId, 
                                            tabName: item.tabName} as never)}
                                    } 
                                    data={item}
                                />}
                            showsHorizontalScrollIndicator={false}
                        />
                    </HStack>
                }

                <HStack space={3} mb={2}>
                    <Filter 
                        type="tasks"
                        title="Rotina do dia"
                        onPress={() => setStatusSelected('tasks')}
                        isActive={statusSelected === "tasks"}
                    />

                    <Filter 
                        type="events"
                        title="Eventos"
                        onPress={() => setStatusSelected('events')}
                        isActive={statusSelected === "events"}
                    />  
                </HStack>

                <HStack w="full" mt={2} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100" >{week[date.getDay()]}</Heading>
                    <Text color="gray.200" >
                        {date.toLocaleDateString('pt-BR')}
                    </Text> 
                </HStack>

                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <Task onPress={() => {Alert.alert('Você clicou na aba:', `${item.title}`)}} data={item}  />}
                    showsVerticalScrollIndicator={false}
                />
            </VStack>
        </VStack>
    );
}