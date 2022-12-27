// Importando bibliotecas.
import { StackActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import '../Globals.js';
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Clipboard,
  Image,
  Alert,
  Text,
  View,
} from 'react-native';

// Propriedades de um sonho:
// id, name, when, sharpness, dream & picture.

const Form = ({ navigation }) => {
  const [id, setId] = useState(-1);
  const [name, setName] = useState('');
  const [when, setWhen] = useState(new Date());
  const [sharpness, setSharpness] = useState(1);
  const [dream, setDream] = useState('');
  const [{ url, picture }, setData] = useState([]);

  const randomPicture = async () => {
    try {
      const response = await fetch('https://api.waifu.pics/sfw/waifu');
      const data = await response.json();
      const url = data.url;

      if (url) setData({ url: url, picture: { uri: url } });
      else setData({ url: '', picture: require('../assets/disconnected.png') });
    } catch (e) {
      setData({ url: '', picture: require('../assets/disconnected.png') });
      console.error('ERRO: ' + e);
    }
  };

  const fetchData = async () => {
    setId(global.selected_id);
    if (global.selected_id >= 0) {
      let dreams = [];
      const response = await SecureStore.getItemAsync('dreams');
      if (response) dreams = JSON.parse(response);

      dreams.map((item) => {
        if (item.id == global.selected_id) {
          setName(item.name);
          setWhen(new Date(item.when));
          setSharpness(item.sharpness);
          setDream(item.dream);
          if (!item.picture || item.picture.trim().length <= 0) randomPicture();
          else setData({ url: item.picture, picture: { uri: item.picture } });
        }
      });
    } else randomPicture();
  };

  const getStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity onPress={() => setSharpness(i)}>
          <Icon
            name={i <= sharpness ? 'star' : 'star-outline'}
            size={global.screen_width / 20}
            color={'#94e1ff'}
          />
        </TouchableOpacity>
      );
    }

    return stars;
  };

  const update = (create = false) => {
    if (name.trim().length <= 0) {
      this.nameInput.focus();
      Alert.alert('Campo obrigatório', 'Dê um nome para seu sonho.');
    } else if (dream.trim().length <= 0) {
      this.dreamInput.focus();
      Alert.alert('Campo obrigatório', 'Descreva um pouco sobre seu sonho.');
    } else {
      Alert.alert(
        create ? 'Adicionando' : 'Atualizando',
        create
          ? 'Você deseja mesmo adicioná-lo?'
          : 'Você deseja mesmo atualizá-lo?',
        [
          { text: 'Cancelar' },
          {
            text: create ? 'Adicionar' : 'Atualizar',
            onPress: async () => {
              try {
                let dreams = [];

                const response = await SecureStore.getItemAsync('dreams');
                if (response) dreams = JSON.parse(response);

                if (create) {
                  dreams.push({
                    id: dreams.length,
                    name: name,
                    when: when,
                    sharpness: sharpness,
                    dream: dream,
                    picture: url,
                  });
                } else {
                  dreams = dreams.map((item) =>
                    item.id == id
                      ? {
                          ...item,
                          name: name,
                          sharpness: sharpness,
                          dream: dream,
                          picture: url,
                        }
                      : item
                  );
                }

                SecureStore.setItemAsync('dreams', JSON.stringify(dreams));
              } catch (e) {
                Alert.alert('Tente novamente mais tarde', 'ERRO: ' + e);
              }

              navigation.popToTop();
              navigation.dispatch(StackActions.replace('Main'));
            },
          },
        ]
      );
    }
  };

  useEffect(() => fetchData(), []); // eslint-disable-line
  return (
    <View
      style={{
        flex: 1,
        padding: global.screen_width / 20,
      }}>
      <View style={{ flex: 0, flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={randomPicture}
          style={{
            flex: 0,
            flexWrap: 'wrap',
            backgroundColor: 'white',
            width: global.screen_width / 4,
            height: global.screen_width / 4,
            borderRadius:
              Math.round(global.screen_width + global.screen_height) / 2,
          }}>
          <Image
            source={picture}
            style={{
              width: '100%',
              aspectRatio: 1,
              height: undefined,
              borderRadius:
                Math.round(global.screen_width + global.screen_height) / 2,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginLeft: global.screen_width / 30,
          }}>
          <View style={styles.input}>
            <TouchableOpacity onPress={() => this.nameInput.focus()}>
              <Icon
                size={global.screen_width / 20}
                name="drive-file-rename-outline"
                color={global.header_background}
                style={{ flex: 0, paddingRight: global.screen_width / 80 }}
              />
            </TouchableOpacity>
            <TextInput
              ref={(input) => {
                this.nameInput = input;
              }}
              value={name}
              maxLength={60}
              onChangeText={setName}
              placeholder="Nomeie o sonho neste campo."
              style={{
                flex: 1,
                color: global.header_background,
                fontSize: global.screen_width / 30,
              }}
            />
          </View>
          <View style={[styles.input, { marginTop: global.screen_width / 60 }]}>
            <TouchableOpacity onPress={() => Clipboard.setString(url)}>
              <Icon
                name="content-copy"
                size={global.screen_width / 20}
                color={global.header_background}
                style={{ flex: 0, paddingRight: global.screen_width / 80 }}
              />
            </TouchableOpacity>
            <TextInput
              value={url}
              maxLength={100}
              editable={false}
              style={{
                flex: 1,
                color: global.header_background,
                fontSize: global.screen_width / 30,
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          margin: global.screen_width / 50,
        }}>
        <TouchableOpacity
          onPress={() =>
            Speech.speak(dream, {
              language: 'pt-BR',
            })
          }
          style={{
            flex: 0,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Icon
            name="multitrack-audio"
            size={global.screen_width / 20}
            color={global.header_background}
            style={{ flex: 0, paddingRight: global.screen_width / 80 }}
          />
          <Text style={{ fontSize: global.screen_width / 30 }}>
            Aperte para ouvir o sonho.
          </Text>
        </TouchableOpacity>
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          {getStars()}
        </View>
      </View>
      <TextInput
        ref={(input) => {
          this.dreamInput = input;
        }}
        value={dream}
        multiline={true}
        onChangeText={setDream}
        placeholder="Descreva o sonho neste campo."
        style={[
          styles.input,
          {
            flex: 1,
            textAlignVertical: 'top',
            padding: global.screen_width / 40,
            fontSize: global.screen_width / 30,
          },
        ]}
      />
      <View
        style={{
          position: 'absolute',
          right: global.screen_width / 40,
          bottom: global.screen_height / 60,
        }}>
        {id >= 0 ? (
          <TouchableOpacity style={styles.button} onPress={() => update()}>
            <Icon
              name="published-with-changes"
              size={global.screen_width / 14.26}
              color="white"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => update(true)}>
            <Icon
              name="post-add"
              size={global.screen_width / 14.26}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Exportando componente.
export default Form;
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: global.screen_width / 60,
    borderColor: global.header_background,
    borderRadius: global.screen_width / 30,
  },
  button: {
    elevation: 6,
    justifyContent: 'center',
    backgroundColor: '#ff94d4',
    width: global.screen_width / 7,
    height: global.screen_width / 7,
    borderRadius: Math.round(global.screen_width + global.screen_height) / 2,
  },
});
