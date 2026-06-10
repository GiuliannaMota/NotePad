import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

type AppButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
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
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style,
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
    return colors.text;
  }

  if (variant === 'danger') {
    return colors.danger;
  }

  return colors.text;
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
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: 'transparent',
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