import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type ButtonVariant = 'primary' | 'outline' | 'danger';

type AppButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
};

export function AppButton({
  title,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      style={(state) => [
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor(variant)} />
      ) : (
        <Text style={[styles.text, { color: getTextColor(variant) }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

function getTextColor(variant: ButtonVariant) {
  if (variant === 'primary') {
    return colors.surface;
  }

  if (variant === 'danger') {
    return colors.danger;
  }

  return colors.primary;
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: typography.body,
    fontWeight: '700',
  },
});