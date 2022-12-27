// Importando bibliotecas.
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import {
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
  View,
} from 'react-native';

// Definindo variáveis globais.
global.header_title = 'Dreambook';
global.header_color = '#ffffff';
global.header_background = '#192131';
global.screen_width = Dimensions.get('screen').width;
global.screen_height = Dimensions.get('screen').height;
global.selected_id = -1;
global.months = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

// Importando componentes.
import Main from './components/Main';
import Form from './components/Form';

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={({ navigation, route }) => ({
          title: global.header_title,
          headerTintColor: global.header_color,
          headerStyle: {
            backgroundColor: global.header_background,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerLeft: () =>
            route.name != 'Main' && (
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => {
                  global.selected_id = -1;
                  navigation.pop();
                }}>
                <Icon name="keyboard-backspace" color={global.header_color} />
              </TouchableOpacity>
            ),
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() =>
                  navigation.dispatch(StackActions.replace(route.name))
                }>
                <Icon name="cached" color={global.header_color} />
              </TouchableOpacity>
              {route.name == 'Main' && (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() =>
                    Alert.alert(
                      'Flaticon',
                      'Todos os ícones foram produzidos por Freepik e estão disponíveis na plataforma Flaticon.',
                      [
                        { text: 'Voltar' },
                        {
                          text: 'Verificar',
                          onPress: async () =>
                            await Linking.openURL(
                              'https://www.flaticon.com/authors/freepik'
                            ),
                        },
                      ]
                    )
                  }>
                  <Icon name="dock" color={global.header_color} />
                </TouchableOpacity>
              )}
            </View>
          ),
        })}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Form" component={Form} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Exportando componente.
export default App;
