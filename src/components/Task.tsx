import { Box, HStack, Pressable, Text, useTheme, VStack, IPressableProps, Image, Heading } from 'native-base';
import { ClockAfternoon } from 'phosphor-react-native'


export type TaskProps = {
    id: string;
    title: string;
    when: string;
    weekday: string;
    type: 'tasks' | 'events';
}

type Props = IPressableProps & {
 data: TaskProps;
}

export function Task({data, ...rest}: Props) {

  const {colors} = useTheme()

  return (
    <Pressable {...rest}>
      <HStack
        bg="gray.600"
        alignItems="center"
        justifyContent="space-between"
        rounded="sm"
        overflow="hidden"
        mb={2}
      >
        <Box h="full" w={2} bg="colors.secondary" />

        <VStack flex={1} my={5} ml={5} >
          <Text color="white" fontSize="md">
              {data.title}
          </Text>

          <HStack alignItems="center" >
              <ClockAfternoon size={15} color={colors.gray[300]}/>
              <Text color="gray.200" fontSize="xs" ml={1}>
              {data.when}
              </Text> 
          </HStack>
        </VStack>
      </HStack>
    </Pressable>
  );
}