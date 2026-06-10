import { useCallback, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '../../components/ui/AppButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/LoadingState';
import type { RootStackParamList } from '../../navigation/types';
import {
  createFolder,
  deleteFolder,
  getFolders,
  updateFolder,
} from '../../services/foldersService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { Folder } from '../../types/folder';
import { getErrorMessage } from '../../utils/getErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'Folders'>;

export function FoldersScreen({ navigation }: Props) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [name, setName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEditing = editingFolderId !== null;

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [])
  );

  async function loadFolders() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getFolders();

      setFolders(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setName('');
    setEditingFolderId(null);
  }

  function handleEdit(folder: Folder) {
    setName(folder.nome);
    setEditingFolderId(folder.id);
  }

  async function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Campo obrigatório', 'Informe o nome da pasta.');
      return;
    }

    try {
      setIsSaving(true);

      if (editingFolderId) {
        await updateFolder(editingFolderId, trimmedName);
      } else {
        await createFolder(trimmedName);
      }

      resetForm();
      await loadFolders();
    } catch (error) {
      Alert.alert('Erro ao salvar pasta', getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function handleConfirmDelete(folder: Folder) {
    Alert.alert(
      'Excluir pasta',
      `Tem certeza que deseja excluir a pasta "${folder.nome}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => handleDelete(folder.id),
        },
      ]
    );
  }

  async function handleDelete(folderId: number) {
    try {
      await deleteFolder(folderId);

      if (editingFolderId === folderId) {
        resetForm();
      }

      await loadFolders();
    } catch (error) {
      Alert.alert(
        'Erro ao excluir pasta',
        'Não foi possível excluir esta pasta. Verifique se existem notas vinculadas a ela.'
      );
    }
  }

  if (isLoading && folders.length === 0) {
    return <LoadingState message="Carregando pastas..." />;
  }

  if (errorMessage && folders.length === 0) {
    return <ErrorState message={errorMessage} onRetry={loadFolders} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Gerenciar pastas</Text>

          <Text style={styles.label}>Nome da pasta</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Faculdade"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.formActions}>
            <AppButton
              title={isEditing ? 'Salvar alterações' : 'Criar pasta'}
              onPress={handleSave}
              isLoading={isSaving}
              style={styles.actionButton}
            />

            {isEditing && (
              <AppButton
                title="Cancelar"
                variant="outline"
                onPress={resetForm}
                style={styles.actionButton}
              />
            )}
          </View>
        </View>

        {errorMessage && <Text style={styles.inlineError}>{errorMessage}</Text>}

        <FlatList
          data={folders}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            styles.listContent,
            folders.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma pasta encontrada"
              description="Crie uma pasta para organizar suas notas."
            />
          }
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
              </View>

              <View style={styles.itemActions}>
                <Pressable
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleConfirmDelete(item)}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
        />

        <AppButton
          title="Voltar para notas"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  formActions: {
    gap: spacing.sm,
  },
  actionButton: {
    alignSelf: 'stretch',
  },
  inlineError: {
    fontSize: typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  itemInfo: {
    gap: spacing.xs,
  },
  itemTitle: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  itemActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.danger,
  },
});