import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

type Props = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  theme?: 'primary';
  onPress: () => void;
  disabled?: boolean;
};

export default function AppButton({
  title,
  icon,
  theme,
  onPress,
  disabled,
}: Props) {
  if (theme === 'primary') {
    return (
      <View style={styles.buttonOuter}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
            disabled && styles.disabled,
          ]}
          onPress={onPress}
          disabled={disabled}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={22}
              color={COLORS.textOnPrimary}
              style={styles.icon}
            />
          )}

          <Text style={styles.primaryLabel}>{title}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonOuter}>
      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color={COLORS.textSecondary}
            style={styles.icon}
          />
        )}

        <Text style={styles.label}>{title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    width: '100%',
    marginBottom: 14,
  },

  primaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
  },

  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.card,
  },

  icon: {
    marginRight: 10,
  },

  primaryLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },

  label: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.6,
  },
});