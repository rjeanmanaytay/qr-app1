import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

import AppButton from '@/components/AppButton';
import { COLORS } from '@/constants/colors';
import { signIn } from '../lib/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert(
        'Error',
        'Please enter your email and password.'
      );
      return;
    }

    try {
      setLoading(true);

      const { error } = await signIn(
        email.trim(),
        password
      );

      if (error) {
        Alert.alert(
          'Login failed',
          error.message
        );
        return;
      }

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);

      Alert.alert(
        'Login failed',
        error instanceof Error
          ? error.message
          : 'Unable to log in.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>
        Student Attendance
      </Text>

      <Text style={styles.subtitle}>
        Log in to continue
      </Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        editable={!loading}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      {/* Login Button */}
      <AppButton
        title={loading ? 'Logging in...' : 'Log In'}
        theme="primary"
        onPress={handleLogin}
        disabled={loading}
      />

      {/* Register Link */}
      <TouchableOpacity
        style={styles.registerContainer}
        onPress={() => router.push('/register')}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={styles.link}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 32,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: COLORS.card,
    color: COLORS.textPrimary,
    fontSize: 16,
  },

  registerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },

  link: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 15,
  },
});