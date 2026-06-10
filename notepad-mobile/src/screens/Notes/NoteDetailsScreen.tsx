import { useCallback, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useNote } from '../../hooks/useNote';
import type { RootStackParamList } from '../../navigation/types';
import {
  deleteNote,
  generateNoteSummary,
} from '../../services/notesService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { stripHtml } from '../../utils/stripHtml';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetails'>;

export function NoteDetailsScreen({ route, navigation }: Props) {
  const { noteId } = route.params;

  const { note, isLoading, errorMessage, loadNote } = useNote(noteId);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadNote();
    }, [loadNote])
  );

  function handleEditNote() {
    navigation.navigate('NoteForm', { noteId });
  }

  function handleConfirmDelete() {
    Alert.alert(
      'Excluir nota',
      'Tem certeza que deseja excluir esta nota? Essa ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: handleDeleteNote,
        },
      ]
    );
  }

  async function handleDeleteNote() {
    try {
      setIsDeleting(true);

      await deleteNote(noteId);

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao excluir nota', getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleGenerateSummary() {
    try {
      setIsGeneratingSummary(true);

      const resumo = await generateNoteSummary(noteId);

      setGeneratedSummary(resumo);

      await loadNote();

      Alert.alert('Resumo gerado', 'O resumo da nota foi gerado com sucesso.');
    } catch (error) {
      Alert.alert('Erro ao gerar resumo', getErrorMessage(error));
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.feedbackText}>Carregando nota...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>

        <Pressable style={styles.primaryButton} onPress={loadNote}>
          <Text style={styles.primaryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.feedbackText}>Nota não encontrada.</Text>
      </View>
    );
  }

  const cleanContent = stripHtml(note.conteudo || '');
  const summaryText = generatedSummary ?? note.resumo;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>{note.titulo}</Text>

      {note.pasta && (
        <View style={styles.section}>
          <Text style={styles.label}>Pasta</Text>
          <Text style={styles.value}>{note.pasta.nome}</Text>
        </View>
      )}

      {note.tags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Tags</Text>

          <View style={styles.tagsContainer}>
            {note.tags.map((tag) => (
              <View key={tag.id} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag.nome}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Conteúdo</Text>

        <Text style={styles.contentText}>
          {cleanContent || 'Esta nota não possui conteúdo.'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Resumo com IA</Text>

        {summaryText ? (
          <Text style={styles.contentText}>{summaryText}</Text>
        ) : (
          <Text style={styles.summaryHint}>
            Esta nota ainda não possui resumo gerado.
          </Text>
        )}

        <Pressable
          style={[
            styles.summaryButton,
            isGeneratingSummary && styles.disabledButton,
          ]}
          onPress={handleGenerateSummary}
          disabled={isGeneratingSummary}
        >
          <Text style={styles.summaryButtonText}>
            {isGeneratingSummary ? 'Gerando resumo...' : 'Gerar resumo com IA'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.actionsContainer}>
        <Pressable style={styles.primaryButton} onPress={handleEditNote}>
          <Text style={styles.primaryButtonText}>Editar nota</Text>
        </Pressable>

        <Pressable
          style={[styles.deleteButton, isDeleting && styles.disabledButton]}
          onPress={handleConfirmDelete}
          disabled={isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? 'Excluindo...' : 'Excluir nota'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.body,
    color: colors.text,
  },
  contentText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  summaryHint: {
    fontSize: typography.body,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagBadge: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  tagText: {
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: spacing.sm,
    marginTop: spacing.sm,
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
  summaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  summaryButtonText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: typography.body,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});