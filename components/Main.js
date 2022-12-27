// Importando bibliotecas.
import { StackActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Alert,
  Text,
  View,
} from 'react-native';

const Main = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [dreams, setDreams] = useState([]);

  const fetchData = async () => {
    const response = await SecureStore.getItemAsync('dreams');
    if (response && response != '') {
      const data = JSON.parse(response);
      if (data.length >= 1) setDreams(data);
    }
  };

  useEffect(() => {
    global.selected_id = -1;
    fetchData();
  }, []);

  const formatDate = (date) => {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = global.months[date.getMonth()];
    var year = date.getFullYear();

    return day + '/' + month + '/' + year;
  };

  const renderPicture = (url) => {
    let connection = true;
    if (!url || url.trim().length <= 0) connection = false;
    else
      fetch(url)
        .then((response) => {
          if (response.status == 404) connection = false;
        })
        .catch((e) => {
          console.error('ERRO: ' + e);
          connection = false;
        });

    return (
      <View style={styles.image}>
        <Image
          source={
            connection ? { uri: url } : require('../assets/disconnected.png')
          }
          style={[
            styles.image,
            {
              width: '100%',
              aspectRatio: 1,
              height: undefined,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: global.screen_width / 20,
      }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 0 }}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'IDe+',
                'Do ponto de vista da ciência, os sonhos são, em sua maioria, ligados a acontecimentos do nosso dia-a-dia. Quando possuem conteúdos desagradáveis, considerados pesadelos, sinalizam que passamos o dia ansiosos ou preocupados e, esses pensamentos negativos, resultam em instabilidade no sono.',
                [{ text: 'Entendi' }]
              )
            }
            style={styles.container}>
            <Image
              source={require('../assets/icon.png')}
              style={[
                styles.image,
                {
                  marginRight: 0,
                  marginLeft: global.screen_width / 48,
                },
              ]}
            />
            <Text style={[styles.text, { textAlign: 'center' }]}>
              Pesadelos sinalizam que passamos o dia ansiosos ou preocupados e,
              esses pensamentos negativos, resultam em instabilidade no sono.
            </Text>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: 1,
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: 'white',
              padding: global.screen_width / 40,
              marginTop: global.screen_width / 26,
              borderColor: global.header_background,
              borderRadius: global.screen_width / 30,
              marginBottom: global.screen_width / 50,
            }}>
            <Icon
              name="youtube-searched-for"
              color={global.header_background}
              size={global.screen_width / 20}
              style={{ flex: 0, paddingRight: global.screen_width / 60 }}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Procurar um sonho..."
              style={{
                flex: 1,
                color: global.header_background,
                fontSize: global.screen_width / 26,
              }}
            />
          </View>
        </View>
        <View>
          <FlatList
            data={dreams}
            renderItem={({ item }) =>
              search.trim().length == 0 ||
              (search.trim().length > 0 &&
                item.name.toUpperCase().includes(search.toUpperCase())) ? (
                <TouchableOpacity
                  onPress={() => {
                    global.selected_id = item.id;
                    navigation.dispatch(StackActions.push('Form'));
                  }}
                  onLongPress={() =>
                    Alert.alert(
                      'Removendo',
                      'Você tem certeza que deseja removê-lo?',
                      [
                        { text: 'Cancelar' },
                        {
                          text: 'Remover',
                          onPress: async () => {
                            let data = [];

                            const response = await SecureStore.getItemAsync(
                              'dreams'
                            );
                            if (response) data = JSON.parse(response);

                            data = data
                              .filter((dream) => dream.id != item.id)
                              .map(
                                ({
                                  id,
                                  name,
                                  when,
                                  sharpness,
                                  dream,
                                  picture,
                                }) => ({
                                  id,
                                  name,
                                  when,
                                  sharpness,
                                  dream,
                                  picture,
                                })
                              );

                            if (data.length > 0)
                              SecureStore.setItemAsync(
                                'dreams',
                                JSON.stringify(data)
                              );
                            else SecureStore.setItemAsync('dreams', '');
                            navigation.dispatch(StackActions.replace('Main'));
                          },
                        },
                      ]
                    )
                  }
                  style={[
                    styles.container,
                    { marginTop: global.screen_width / 60 },
                  ]}>
                  {renderPicture(item.picture)}
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginBottom: global.screen_width / 100,
                      }}>
                      <Text numberOfLines={1} style={styles.text}>
                        {item.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.text,
                          {
                            flex: 0,
                            color: '#85def8',
                          },
                        ]}>
                        {formatDate(new Date(item.when))}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[styles.text, { flex: 0, color: '#c9f0ff' }]}>
                      {item.dream}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          elevation: 6,
          position: 'absolute',
          justifyContent: 'center',
          backgroundColor: '#ff94d4',
          width: global.screen_width / 7,
          right: global.screen_width / 40,
          height: global.screen_width / 7,
          bottom: global.screen_height / 60,
          borderRadius:
            Math.round(global.screen_width + global.screen_height) / 2,
        }}
        onPress={() => {
          global.selected_id = -1;
          navigation.dispatch(StackActions.push('Form'));
        }}>
        <Icon name="add" size={global.screen_width / 10} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// Exportando componente.
export default Main;
const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
    padding: global.screen_width / 30,
    borderRadius: global.screen_width / 30,
    backgroundColor: global.header_background,
  },

  image: {
    flex: 0,
    width: global.screen_width / 8,
    height: global.screen_width / 8,
    marginRight: global.screen_width / 32,
    borderRadius: Math.round(global.screen_width + global.screen_height) / 2,
  },

  text: {
    flex: 1,
    color: 'white',
    fontSize: global.screen_width / 30,
  },
});
