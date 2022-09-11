import { VStack, IButtonProps, Button, Text, useTheme } from 'native-base';

type Props = IButtonProps & {
    title: string;
    isActive?: boolean;
    type: 'tasks' | 'events';
}

export function Filter({title, isActive= false, type, ...rest}: Props) {
    const {colors} = useTheme()

    const colorType = type === "tasks" ? colors.secondary[700] : colors.blue[600]

  return (
    <Button 
        variant="outline"
        borderWidth={isActive ? 1 : 0}
        borderColor={colorType} 
        bg="gray.600"
        flex={1}
        size="sm"
        {...rest}
    >
        <Text color={isActive ? colorType : "gray.300"} fontSize="xs" textTransform="uppercase" >
            {title}
        </Text>
    </Button>
  );
}