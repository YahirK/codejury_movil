import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { Button, Input } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, UserRole } from '../../types';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [role, setRole] = useState<UserRole>('evaluado');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Evaluado fields
    const [specialty, setSpecialty] = useState('');
    // Evaluador fields
    const [employeeCode, setEmployeeCode] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.replace('Login');
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
                        <Text style={styles.tagline}>Únete al equipo de evaluación académica</Text>
                    </View>

                    {/* Role Toggle */}
                    <View style={styles.roleToggle}>
                        <Text style={styles.roleLabel}>Selecciona tu Rol</Text>
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    role === 'evaluador' && styles.toggleButtonActive,
                                ]}
                                onPress={() => setRole('evaluador')}
                            >
                                <Text
                                    style={[
                                        styles.toggleText,
                                        role === 'evaluador' && styles.toggleTextActive,
                                    ]}
                                >
                                    Evaluador
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    role === 'evaluado' && styles.toggleButtonActive,
                                ]}
                                onPress={() => setRole('evaluado')}
                            >
                                <Text
                                    style={[
                                        styles.toggleText,
                                        role === 'evaluado' && styles.toggleTextActive,
                                    ]}
                                >
                                    Evaluado
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Nombre Completo"
                            placeholder="Juan Pérez"
                            value={name}
                            onChangeText={setName}
                            icon={<Text style={styles.inputIcon}>{role === 'evaluado' ? '🎓' : '👤'}</Text>}
                        />

                        <Input
                            label="Correo Institucional"
                            placeholder="usuario@institucion.edu"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon={<Text style={styles.inputIcon}>✉️</Text>}
                        />

                        {role === 'evaluado' ? (
                            <Input
                                label="Especialidad"
                                placeholder="Ingeniería de Software"
                                value={specialty}
                                onChangeText={setSpecialty}
                                icon={<Text style={styles.inputIcon}>🎯</Text>}
                            />
                        ) : (
                            <>
                                <Input
                                    label="Código de Empleado"
                                    placeholder="EMP-2024-001"
                                    value={employeeCode}
                                    onChangeText={setEmployeeCode}
                                    icon={<Text style={styles.inputIcon}>🏢</Text>}
                                />
                                <Input
                                    label="Departamento"
                                    placeholder="Ciencias Computacionales"
                                    value={department}
                                    onChangeText={setDepartment}
                                    icon={<Text style={styles.inputIcon}>📚</Text>}
                                />
                            </>
                        )}

                        <Input
                            label="Contraseña"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Text style={styles.inputIcon}>🔒</Text>}
                        />
                    </View>

                    {/* Register Button */}
                    <Button
                        title="Crear Cuenta"
                        onPress={handleRegister}
                        loading={loading}
                        size="lg"
                        style={styles.registerButton}
                    />

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Terms */}
                    <Text style={styles.terms}>
                        Al registrarte aceptas los Términos de Servicio de CodeJury
                    </Text>
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
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    logoIcon: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primaryLight + '40',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    logoIconText: {
        fontSize: 32,
    },
    logoText: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    roleToggle: {
        marginBottom: spacing.lg,
    },
    roleLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.inputBorder,
        borderRadius: borderRadius.xl,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: borderRadius.xl,
    },
    toggleButtonActive: {
        backgroundColor: colors.primary,
    },
    toggleText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    toggleTextActive: {
        color: colors.white,
    },
    form: {
        marginBottom: spacing.md,
    },
    inputIcon: {
        fontSize: 18,
        opacity: 0.6,
    },
    registerButton: {
        marginBottom: spacing.md,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    loginText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    loginLink: {
        fontSize: fontSize.md,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    terms: {
        textAlign: 'center',
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
});

export default RegisterScreen;
