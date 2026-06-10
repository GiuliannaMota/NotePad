import { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { NoteCard } from '../../components/notes/NoteCard';
import { AppButton } from '../../components/ui/AppButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/LoadingState';
import { useNotes } from '../../hooks/useNotes';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'NotesList'>;

export function NotesListScreen({ navigation }: Props) {
  const { notes, isLoading, errorMessage, loadNotes } = useNotes();

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  function handleOpenNote(noteId: number) {
    navigation.navigate('NoteDetails', { noteId });
  }

  function handleCreateNote() {
    navigation.navigate('NoteForm');
  }

  function handleOpenFolders() {
    navigation.navigate('Folders');
  }

  function handleOpenTags() {
    navigation.navigate('Tags');
  }

  const isFirstLoading = isLoading && notes.length === 0;

  if (isFirstLoading) {
    return <LoadingState message="Carregando notas..." />;
  }

  if (errorMessage && notes.length === 0) {
    return <ErrorState message={errorMessage} onRetry={loadNotes} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Minhas notas</Text>

          <Text style={styles.subtitle}>
            {notes.length === 1
              ? '1 nota cadastrada'
              : `${notes.length} notas cadastradas`}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <AppButton title="Nova nota" onPress={handleCreateNote} />

          <View style={styles.secondaryActions}>
            <AppButton
              title="Pastas"
              variant="secondary"
              onPress={handleOpenFolders}
              style={styles.secondaryButton}
            />

            <AppButton
              title="Tags"
              variant="secondary"
              onPress={handleOpenTags}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </View>

      {errorMessage && <Text style={styles.inlineError}>{errorMessage}</Text>}

      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadNotes}
            tintColor={colors.primaryLight}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          notes.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma nota encontrada"
            description="Crie sua primeira nota para começar."
          />
        }
        renderItem={({ item }) => (
          <NoteCard note={item} onPress={() => handleOpenNote(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  headerTextContainer: {
    gap: spacing.xs,
  },
  headerActions: {
    gap: spacing.sm,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  inlineError: {
    fontSize: typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  listContent: {
    gap: 14,
    paddingBottom: spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});