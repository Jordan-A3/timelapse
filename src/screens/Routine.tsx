import { useState, useEffect } from "react";
import { Heading, VStack, Icon, useTheme, HStack, IconButton, Checkbox, Text, Button, Pressable, Image, Select, CheckIcon, Flex, FlatList, Modal } from "native-base";

import { ArrowLeft, CalendarPlus, Plus } from 'phosphor-react-native';

import firestore from '@react-native-firebase/firestore'

import getAuth from "@react-native-firebase/auth"

import { Input } from "../components/Input";
import { Button as ButtonComponent } from "../components/Button";
import { Alert, Platform } from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

import { useNavigation, useRoute } from "@react-navigation/native";
import { Task, TaskProps } from "../components/Task";

import moment from 'moment'

type RouteParams = {
    userId: string;
  }

export function Routine(){
    const [isLoading, setIsLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [time, setTime] = useState('')

    const date = new Date()

    const [tasks, setTasks] = useState<TaskProps[]>([])

    const week = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    const [day, setDay] = useState(week[date.getDay()]);

    const [showModal, setShowModal] = useState(false);

    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);

    const {colors} = useTheme()

    const navigation = useNavigation()

    const route = useRoute()
    const { userId} = route.params as RouteParams;


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

            setTasks(allTasks)
        })

        return subscriber
    }, [day])


    function handleNewTask(){
        if(!title || !time){
          return Alert.alert("Registrar", "Preencha todos os campos.")
        }
    
        setIsLoading(true)
        firestore()
          .collection('tasks')
          .add({
            title, 
            userId: userId,
            type: "tasks",
            weekday: day,
            when: time
          })
          .then(() => {
            Alert.alert("Tarefa", "Tarefa registrada com sucesso.")
          })
          .catch(error => {
            console.log(error)
            setIsLoading(false)
            return Alert.alert("Tarefa", "Não foi possível registrar a tarefa")
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

            <VStack flex={1} px={6}>
                <Select selectedValue={day} minWidth="200" accessibilityLabel="Choose Day" placeholder="Dia da semana" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                }} mt={1} color={colors.white} onValueChange={itemValue => setDay(itemValue)}>
                    {week.map(day => (
                        <Select.Item key={day} label={day} value={day} />
                    ))}
                </Select>

                <HStack w="full" mt={2} mb={4} justifyContent="space-between" alignItems="center">
                    <IconButton
                        icon={<Plus size={26} color={colors.gray[300]} />}
                        onPress={() => {setShowModal(true)}}
                    />
                    <Text color="gray.200" >
                        Adicionar tarefa
                    </Text> 
                </HStack>

                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px" bg={colors.gray[600]} >
                        <Modal.CloseButton />
                        <Modal.Header>Criar tarefa</Modal.Header>
                        <Modal.Body>
                            <Input 
                                placeholder="Título" 
                                mb={5} 
                                value={title} 
                                onChangeText={setTitle} 
                            />

                            <Pressable onPress={() => setShow(true)} >
                                <HStack
                                    bg="gray.700"
                                    h={14}
                                    mb={5}
                                    size="md"
                                    borderRadius={5}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text bold ml={2} color={colors.gray[300]} >{!time ? "Escolher horário" : time} </Text>
                                </HStack>
                            </Pressable>

                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    themeVariant="dark"
                                    value={new Date()}
                                    mode={"time"}
                                    is24Hour={true}
                                    onChange={(e, value) => {
                                        setShow(false)
                                        setTime(`${moment(value).format('LT')}`)
                                    }}
                                />
                            )}

                            <Select selectedValue={day} minWidth="200" accessibilityLabel="Choose Day" placeholder="Dia da semana" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1} color={colors.white} onValueChange={itemValue => setDay(itemValue)}>
                                {week.map(day => (
                                    <Select.Item key={day} label={day} value={day} />
                                ))}
                            </Select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                                }}>
                                    Cancel
                                </Button>
                                <Button isLoading={isLoading} onPress={() => {
                                    handleNewTask()
                                    setShowModal(false);
                                }}>
                                    Save
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <Task onPress={() => {Alert.alert('Você clicou na aba:', `${item.title}`)}} data={item}  />}
                    showsVerticalScrollIndicator={false}
                />
                <ButtonComponent title="Criar" />
            </VStack>
        </VStack>
    )
}