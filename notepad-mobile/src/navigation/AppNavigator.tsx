import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FoldersScreen } from '../screens/Folders/FoldersScreen';
import { NoteDetailsScreen } from '../screens/Notes/NoteDetailsScreen';
import { NoteFormScreen } from '../screens/Notes/NoteFormScreen';
import { NotesListScreen } from '../screens/Notes/NotesListScreen';
import { TagsScreen } from '../screens/Tags/TagsScreen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.backgroundSoft,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="NotesList"
        screenOptions={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.backgroundSoft,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
          headerShadowVisible: true,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="NotesList"
          component={NotesListScreen}
          options={{
            title: 'NotePad',
          }}
        />

        <Stack.Screen
          name="NoteDetails"
          component={NoteDetailsScreen}
          options={{
            title: 'Detalhes da nota',
          }}
        />

        <Stack.Screen
          name="NoteForm"
          component={NoteFormScreen}
          options={({ route }) => ({
            title: route.params?.noteId ? 'Editar nota' : 'Nova nota',
          })}
        />

        <Stack.Screen
          name="Folders"
          component={FoldersScreen}
          options={{
            title: 'Pastas',
          }}
        />

        <Stack.Screen
          name="Tags"
          component={TagsScreen}
          options={{
            title: 'Tags',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}