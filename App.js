import React, {useState, useEffect} from 'react';
import SearchInput, {createFilter} from 'react-native-search-filter';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import axios from 'axios';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Body,
  Text,
} from 'native-base';

export const AppList = ({navigation}) => {
  const [pageCount, setPageCount] = useState(0);
  const [data, setDataSource] = useState([]);
  const [serchTerm, setSerchTerm] = useState('');

  useEffect(() => {
    setInterval(() => {
      getData();
    }, 10000);
  });

  const getData = () => {
    const url = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageCount}`;
    axios.get(url).then((res) => {
      console.log(res);
      setDataSource([...data, ...res.data.hits]);
      setPageCount(pageCount + 1);
    });
  };

  const filetrData = data.filter(createFilter(serchTerm, ['title']));

  return (
    <Container>
      <Header />
      <SearchInput
        onChangeText={setSerchTerm}
        placeholder="search"
        style={{
          padding: 10,
          borderColor: '#ccc',
          borderWidth: 1,
        }}
      />
      <Content>
        {filetrData.map((item) => (
          <List>
            <ListItem
              onPress={() => navigation.navigate('DisplayJson', {item: item})}>
              <Body>
                <Text>{item.title}</Text>
                <Text note>Created At: {item.created_at}</Text>
                <Text note>author: {item.author}</Text>
              </Body>
            </ListItem>
          </List>
        ))}
      </Content>
    </Container>
  );
};

const DisplayJson = (item) => {
  return <Text>{JSON.stringify(item.route.params.item)}</Text>;
};

const Stack = createStackNavigator();

export const MyApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={AppList} options={{title: ''}} />
        <Stack.Screen name="DisplayJson" component={DisplayJson} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
