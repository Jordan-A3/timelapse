import { HStack, Pressable, Text, useTheme, VStack, IPressableProps, Image } from 'native-base';
import { Plus } from 'phosphor-react-native';


export type TabProps = {
    id: string;
    tabName: string;
    imageUrl?: string;
    userId: string;
    type: string;
}

type Props = IPressableProps & {
 data: TabProps;
}

export function TabComponent({data, ...rest}: Props) {

  const {colors} = useTheme()

  return (
    <Pressable {...rest}>
      <HStack
        bg="gray.600"
        alignItems="center"
        justifyContent="center"
        rounded="sm"
        overflow="hidden"
        w={100}
        h={100}
        mr={2}
        mb={8}
      >
        {
          data.imageUrl ? 
          <Image 
                source={{
                    uri: data.imageUrl as string
                }} 
                size={100}
                alt="tabImage"
            /> :
            <Plus size={120} color={colors.gray[300]} />
        }
            <VStack 
                flex={1} 
                height={100}
                position="absolute" 
                justifyContent="center"
                bg={'rgba(52, 52, 52, 0.8)'} 
            >
                <Text 
                    fontSize="md" 
                    bold  
                    px={90} 
                    color={colors.white}
                > 
                    {data.tabName.toUpperCase()} 
                </Text>
            </VStack>
      </HStack>
    </Pressable>
  );
}