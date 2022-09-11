import { FlatList, Heading, HStack, IconButton, Text, useTheme, VStack } from 'native-base';
import { SignOut, CalendarPlus } from 'phosphor-react-native'
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Filter } from '../components/Filter';
import { TabComponent, TabProps } from '../components/TabComponent';
import { Task, TaskProps } from '../components/Task';
import firestore from "@react-native-firebase/firestore"

export function Home() {
    const [statusSelected, setStatusSelected] = useState<'tasks' | 'events'>('tasks')
    const [tabs, setTabs] = useState<TabProps[]>([])

    const date = new Date()

    const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    const [tasks, setTasks] = useState<TaskProps[]>([
        {
            id: "3",
            type: "tasks",
            title: "Arrumar casa",
            weekday: "sabado",
            when: `${date.getHours()}:${date.getMinutes()}`
        }
    ])

    const {colors} = useTheme()

    // useEffect(() => {
        
    // }, [setStatusSelected])

    useEffect(() => {
        const subscriber = firestore()
        .collection('tabs')
        .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => {
                const { tabName, imageUrl } = doc.data();

                return {
                    id: doc.id,
                    tabName,
                    imageUrl 
                }
            })

            const allTabs = [...data, {
                id: "10",
                tabName: "Create",
                imageUrl: "https://s2.glbimg.com/nIqfLY3zjr8JntK_zMS9QxXFaZk=/e.glbimg.com/og/ed/f/original/2020/09/05/alfons-morales-ylswjsy7stw-unsplash.jpg",
                first: 'yes',
            }]

            setTabs(allTabs)
        })

        return subscriber
    }, [])

    function handleLogOut(){
        Alert.alert("Sair", "LogOut")
    }

    function createNewRoutine(){
        Alert.alert("Lest's go", "Create")
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
                <HStack mt={8} justifyContent="space-between" alignItems="center">   
                    <FlatList
                        horizontal
                        data={tabs}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => <TabComponent onPress={() => {Alert.alert('Você clicou na aba:', `${item.tabName}`)}} data={item}/>}
                        showsHorizontalScrollIndicator={false}
                    />
                </HStack>

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
                    <Heading color="gray.100" >{semana[date.getDay()]}</Heading>
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