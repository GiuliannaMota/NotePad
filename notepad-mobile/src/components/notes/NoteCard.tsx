import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { Note } from '../../types/note';
import { formatDate } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

type NoteCardProps = {
  note: Note;
  onPress: () => void;
};

export function NoteCard({ note, onPress }: NoteCardProps) {
  const cleanContent = stripHtml(note.conteudo || '');
  const formattedDate = formatDate(note.dataCriacao);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{note.titulo}</Text>

      <Text style={styles.content} numberOfLines={2}>
        {cleanContent || 'Sem conteúdo'}
      </Text>

      <View style={styles.footer}>
        {note.pasta && <Text style={styles.meta}>Pasta: {note.pasta.nome}</Text>}

        {formattedDate && <Text style={styles.meta}>{formattedDate}</Text>}
      </View>

      {note.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map((tag) => (
            <View key={tag.id} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag.nome}</Text>
            </View>
          ))}

          {note.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{note.tags.length - 3}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  content: {
    fontSize: typography.body,
    color: colors.text,
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  footer: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: typography.caption,
    color: colors.text,
    opacity: 0.75,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
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
  moreTagsText: {
    fontSize: typography.caption,
    color: colors.textMuted,
    alignSelf: 'center',
  },
});