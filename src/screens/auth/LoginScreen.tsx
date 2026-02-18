import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { Button, Input } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        // Simulate login - will connect to backend later
        setTimeout(() => {
            setLoading(false);
            // For demo, navigate to professor dashboard
            navigation.replace('DashboardEvaluador');
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoIcon}>
                            <Text style={styles.logoIconText}>⚖</Text>
                        </View>
                        <Text style={styles.logoText}>CodeJury</Text>
                        <Text style={styles.tagline}>Evaluación académica profesional</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Usuario"
                            placeholder="nombre.apellido"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            icon={<Text style={styles.inputIcon}>👤</Text>}
                        />

                        <Input
                            label="Contraseña"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Text style={styles.inputIcon}>🔒</Text>}
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <Button
                        title="Entrar"
                        onPress={handleLogin}
                        loading={loading}
                        size="lg"
                        style={styles.loginButton}
                    />

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerLink}>Regístrate aquí</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Version */}
                    <Text style={styles.version}>v2.4.0 (Build 302)</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logoIcon: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryLight + '40',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    logoIconText: {
        fontSize: 40,
    },
    logoText: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    form: {
        marginBottom: spacing.lg,
    },
    inputIcon: {
        fontSize: 18,
        opacity: 0.6,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: spacing.xs,
    },
    forgotPasswordText: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.medium,
    },
    loginButton: {
        marginBottom: spacing.lg,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: spacing.xxl,
    },
    registerText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    registerLink: {
        fontSize: fontSize.md,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    version: {
        textAlign: 'center',
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 'auto',
    },
});

export default LoginScreen;
