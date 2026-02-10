import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Animated,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { Button } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type ConfirmacionCargaScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ConfirmacionCarga'>;
    route: RouteProp<RootStackParamList, 'ConfirmacionCarga'>;
};

export const ConfirmacionCargaScreen: React.FC<ConfirmacionCargaScreenProps> = ({ navigation, route }) => {
    const { filesCount, totalSize } = route.params;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleGoBack = () => {
        navigation.popToTop();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Success Animation */}
                <Animated.View style={[
                    styles.successCircle,
                    { transform: [{ scale: scaleAnim }] }
                ]}>
                    <View style={styles.innerCircle}>
                        <Text style={styles.successIcon}>✓</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.textContent, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>¡Evidencias Enviadas!</Text>
                    <Text style={styles.subtitle}>
                        Tus archivos han sido cargados exitosamente y están siendo procesados.
                    </Text>

                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryIcon}>📁</Text>
                            <View style={styles.summaryInfo}>
                                <Text style={styles.summaryLabel}>Archivos enviados</Text>
                                <Text style={styles.summaryValue}>{filesCount} archivos</Text>
                            </View>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryIcon}>💾</Text>
                            <View style={styles.summaryInfo}>
                                <Text style={styles.summaryLabel}>Tamaño total</Text>
                                <Text style={styles.summaryValue}>{totalSize}</Text>
                            </View>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryIcon}>⏱️</Text>
                            <View style={styles.summaryInfo}>
                                <Text style={styles.summaryLabel}>Estado</Text>
                                <View style={styles.statusBadge}>
                                    <View style={styles.statusDot} />
                                    <Text style={styles.statusText}>En proceso de revisión</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Next Steps */}
                    <View style={styles.nextStepsCard}>
                        <Text style={styles.nextStepsTitle}>¿Qué sigue?</Text>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepNumber}>1</Text>
                            <Text style={styles.stepText}>Tu evaluador revisará las evidencias</Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepNumber}>2</Text>
                            <Text style={styles.stepText}>Recibirás una notificación cuando sea calificado</Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepNumber}>3</Text>
                            <Text style={styles.stepText}>Podrás ver tus resultados en el dashboard</Text>
                        </View>
                    </View>

                    <Button
                        title="Volver al Dashboard"
                        onPress={handleGoBack}
                        size="lg"
                        style={styles.backButton}
                    />
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
        alignItems: 'center',
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.completedBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    innerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.completed,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successIcon: {
        fontSize: 40,
        color: colors.white,
        fontWeight: fontWeight.bold,
    },
    textContent: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        ...shadows.md,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    summaryIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    summaryInfo: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    summaryValue: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: colors.inputBorder,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.pending,
        marginRight: spacing.xs,
    },
    statusText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.pending,
    },
    nextStepsCard: {
        width: '100%',
        backgroundColor: colors.primaryLight + '15',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    nextStepsTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        color: colors.white,
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        textAlign: 'center',
        lineHeight: 24,
        marginRight: spacing.sm,
        overflow: 'hidden',
    },
    stepText: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    backButton: {
        width: '100%',
    },
});

export default ConfirmacionCargaScreen;
