import { useCallback, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { RootStackParamList } from '../../navigation/types';
import { getFolders } from '../../services/foldersService';
import {
  createNote,
  getNoteById,
  updateNote,
} from '../../services/notesService';
import { getTags } from '../../services/tagsService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { Folder } from '../../types/folder';
import type { Tag } from '../../types/tag';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { stripHtml } from '../../utils/stripHtml';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteForm'>;

export function NoteFormScreen({ route, navigation }: Props) {
  const noteId = route.params?.noteId;
  const isEditing = Boolean(noteId);

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [noteId])
  );

  async function loadInitialData() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [foldersData, tagsData] = await Promise.all([
        getFolders(),
        getTags(),
      ]);

      setFolders(foldersData);
      setTags(tagsData);

      if (noteId) {
        const note = await getNoteById(noteId);

        setTitulo(note.titulo);
        setConteudo(stripHtml(note.conteudo || ''));
        setSelectedFolderId(note.pasta?.id ?? null);
        setSelectedTagIds(note.tags.map((tag) => tag.id));

        return;
      }

      if (foldersData.length > 0) {
        setSelectedFolderId(foldersData[0].id);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggleTag(tagId: number) {
    setSelectedTagIds((currentTagIds) => {
      const tagAlreadySelected = currentTagIds.includes(tagId);

      if (tagAlreadySelected) {
        return currentTagIds.filter((id) => id !== tagId);
      }

      return [...currentTagIds, tagId];
    });
  }

  function validateForm() {
    if (!titulo.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o título da nota.');
      return false;
    }

    if (!conteudo.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o conteúdo da nota.');
      return false;
    }

    if (!selectedFolderId) {
      Alert.alert(
        'Pasta obrigatória',
        'Selecione uma pasta para salvar a nota.'
      );
      return false;
    }

    return true;
  }

  async function handleSaveNote() {
    const formIsValid = validateForm();

    if (!formIsValid || !selectedFolderId) {
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        pastaId: selectedFolderId,
        tagIds: selectedTagIds,
      };

      if (noteId) {
        await updateNote(noteId, payload);
      } else {
        await createNote(payload);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao salvar nota', getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.feedbackText}>Carregando formulário...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>

        <Pressable style={styles.primaryButton} onPress={loadInitialData}>
          <Text style={styles.primaryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  const hasFolders = folders.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {isEditing ? 'Editar nota' : 'Nova nota'}
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o título da nota"
            placeholderTextColor={colors.textMuted}
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Conteúdo</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite o conteúdo da nota"
            placeholderTextColor={colors.textMuted}
            value={conteudo}
            onChangeText={setConteudo}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pasta</Text>

          {!hasFolders ? (
            <Text style={styles.helperText}>
              Nenhuma pasta encontrada. Crie uma pasta pelo backend ou pela
              versão web antes de salvar notas no mobile.
            </Text>
          ) : (
            <View style={styles.optionsContainer}>
              {folders.map((folder) => {
                const isSelected = folder.id === selectedFolderId;

                return (
                  <Pressable
                    key={folder.id}
                    style={[
                      styles.optionChip,
                      isSelected && styles.selectedChip,
                    ]}
                    onPress={() => setSelectedFolderId(folder.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedChipText,
                      ]}
                    >
                      {folder.nome}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tags</Text>

          {tags.length === 0 ? (
            <Text style={styles.helperText}>
              Nenhuma tag encontrada. A nota pode ser salva sem tags.
            </Text>
          ) : (
            <View style={styles.optionsContainer}>
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);

                return (
                  <Pressable
                    key={tag.id}
                    style={[
                      styles.optionChip,
                      isSelected && styles.selectedChip,
                    ]}
                    onPress={() => handleToggleTag(tag.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedChipText,
                      ]}
                    >
                      {tag.nome}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <Pressable
          style={[
            styles.saveButton,
            (!hasFolders || isSaving) && styles.disabledButton,
          ]}
          onPress={handleSaveNote}
          disabled={!hasFolders || isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar nota'}
          </Text>
        </Pressable>
      </ScrollView>
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
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  feedbackText: {
    marginTop: spacing.md,
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.body,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body,
    color: colors.text,
  },
  textArea: {
    minHeight: 180,
  },
  helperText: {
    fontSize: typography.caption,
    color: colors.textMuted,
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  selectedChipText: {
    color: colors.surface,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});