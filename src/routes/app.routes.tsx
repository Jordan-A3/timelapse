import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SignIn } from '../screens/SignIn'
import { Home } from '../screens/Home'
import { CreateTab } from '../screens/CreateTab'
import { Tab } from '../screens/Tab'
import { Routine } from '../screens/Routine'

const {Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes(){
    return(
        <Navigator screenOptions={{ headerShown: false}} >
            <Screen name="home" component={Home} />
            <Screen name="signin" component={SignIn} />
            <Screen name="createtab" component={CreateTab} />
            <Screen name="tab" component={Tab} />
            <Screen name='routine' component={Routine} />
        </Navigator>
    )
}