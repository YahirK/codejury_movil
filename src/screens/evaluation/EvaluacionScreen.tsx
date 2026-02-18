import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { Button } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type EvaluacionScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Evaluacion'>;
    route: RouteProp<RootStackParamList, 'Evaluacion'>;
};

interface Criterion {
    id: string;
    name: string;
    description: string;
    score: number;
    justification: string;
}

// Mock data
const mockStudent = {
    name: 'Juan Pérez',
    project: 'Sistema de Gestión de Inventario',
    avatar: '',
};

const initialCriteria: Criterion[] = [
    {
        id: '1',
        name: 'Calidad del Código',
        description: 'Evalúa la limpieza, eficiencia, modularidad y apego a los estándares definidos en clase.',
        score: 9,
        justification: '',
    },
    {
        id: '2',
        name: 'Funcionalidad',
        description: '¿El sistema cumple con todos los requisitos funcionales especificados en la propuesta?',
        score: 5,
        justification: '',
    },
    {
        id: '3',
        name: 'UX/UI Design',
        description: 'Evaluación de la experiencia de usuario, usabilidad móvil y consistencia visual.',
        score: 1,
        justification: '',
    },
];

const getScoreLabel = (score: number): string => {
    if (score >= 9) return 'Excelente';
    if (score >= 7) return 'Bueno';
    if (score >= 5) return 'Regular';
    if (score >= 3) return 'Deficiente';
    return 'Muy Deficiente';
};

const getScoreColor = (score: number): string => {
    if (score >= 9) return colors.completed;
    if (score >= 7) return colors.primary;
    if (score >= 5) return colors.pending;
    if (score >= 3) return colors.inReview;
    return colors.error;
};

const isExtremeScore = (score: number): boolean => {
    return score <= 2 || score >= 9;
};

export const EvaluacionScreen: React.FC<EvaluacionScreenProps> = ({ navigation, route }) => {
    const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);
    const [showDraftBanner, setShowDraftBanner] = useState(true);

    const updateScore = (id: string, score: number) => {
        setCriteria(prev =>
            prev.map(c => (c.id === id ? { ...c, score } : c))
        );
    };

    const updateJustification = (id: string, justification: string) => {
        setCriteria(prev =>
            prev.map(c => (c.id === id ? { ...c, justification } : c))
        );
    };

    const handleFinish = () => {
        // Validate extreme scores have justification
        const invalidCriteria = criteria.filter(
            c => isExtremeScore(c.score) && !c.justification.trim()
        );

        if (invalidCriteria.length > 0) {
            // Show error - would use Alert or Toast in real app
            console.log('Justificación requerida para notas extremas');
            return;
        }

        navigation.navigate('ResumenEvaluacion', { evaluationId: route.params.projectId });
    };

    const renderCriterionCard = (criterion: Criterion, index: number) => {
        const scoreColor = getScoreColor(criterion.score);
        const isExtreme = isExtremeScore(criterion.score);
        const needsJustification = isExtreme && !criterion.justification.trim();

        return (
            <View key={criterion.id} style={styles.criterionCard}>
                <View style={styles.criterionHeader}>
                    <Text style={styles.criterionName}>{criterion.name}</Text>
                    <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
                        <Text style={styles.scoreBadgeText}>{criterion.score}</Text>
                    </View>
                </View>

                <Text style={styles.criterionDescription}>{criterion.description}</Text>

                <View style={styles.sliderSection}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.sliderLabel}>PUNTUACIÓN</Text>
                        <Text style={[styles.sliderValue, { color: scoreColor }]}>
                            {getScoreLabel(criterion.score)}
                        </Text>
                    </View>

                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderTrack}>
                            <View
                                style={[
                                    styles.sliderFill,
                                    {
                                        width: `${criterion.score * 10}%`,
                                        backgroundColor: scoreColor,
                                    }
                                ]}
                            />
                            <View
                                style={[
                                    styles.sliderThumb,
                                    {
                                        left: `${criterion.score * 10}%`,
                                        backgroundColor: scoreColor,
                                    }
                                ]}
                            />
                        </View>
                        <View style={styles.sliderLabels}>
                            <Text style={styles.sliderMinMax}>1</Text>
                            <Text style={styles.sliderMinMax}>10</Text>
                        </View>
                    </View>

                    {/* Simple score buttons for demo */}
                    <View style={styles.scoreButtons}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                            <TouchableOpacity
                                key={score}
                                style={[
                                    styles.scoreButton,
                                    criterion.score === score && { backgroundColor: scoreColor },
                                ]}
                                onPress={() => updateScore(criterion.id, score)}
                            >
                                <Text style={[
                                    styles.scoreButtonText,
                                    criterion.score === score && { color: colors.white },
                                ]}>
                                    {score}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.justificationSection}>
                    <Text style={styles.justificationLabel}>
                        Justificación {isExtreme ? '*' : '(Opcional)'}
                    </Text>
                    <TextInput
                        style={[
                            styles.justificationInput,
                            needsJustification && styles.justificationInputError,
                        ]}
                        placeholder={isExtreme
                            ? 'Explica el motivo de la calificación baja...'
                            : 'Agregar observaciones...'
                        }
                        placeholderTextColor={colors.placeholder}
                        value={criterion.justification}
                        onChangeText={(text) => updateJustification(criterion.id, text)}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                    {needsJustification && (
                        <View style={styles.warningContainer}>
                            <Text style={styles.warningIcon}>⚠️</Text>
                            <Text style={styles.warningText}>
                                Justificación obligatoria (Puntuación extrema: {criterion.score})
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        Evaluación: Proyect...
                    </Text>
                </View>
                <View style={styles.connectionBadge}>
                    <View style={styles.connectionDot} />
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Student Info */}
                <View style={styles.studentCard}>
                    <View style={styles.studentInfo}>
                        <Text style={styles.studentLabel}>Estudiante</Text>
                        <Text style={styles.studentName}>{mockStudent.name}</Text>
                        <Text style={styles.projectName}>{mockStudent.project}</Text>
                    </View>
                    <View style={styles.studentAvatar}>
                        <Text style={styles.avatarEmoji}>👨‍💻</Text>
                    </View>
                </View>

                {/* Rubric Header */}
                <View style={styles.rubricHeader}>
                    <Text style={styles.rubricTitle}>Rúbrica de Evaluación</Text>
                    <Text style={styles.rubricCount}>{criteria.length} criterios</Text>
                </View>

                {/* Criteria */}
                {criteria.map((criterion, index) => renderCriterionCard(criterion, index))}

                {/* Finish Button */}
                <Button
                    title="Finalizar Evaluación"
                    onPress={handleFinish}
                    size="lg"
                    style={styles.finishButton}
                />
            </ScrollView>

            {/* Draft Banner */}
            {showDraftBanner && (
                <View style={styles.draftBanner}>
                    <Text style={styles.draftIcon}>✓</Text>
                    <Text style={styles.draftText}>Guardado en borrador local</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
        backgroundColor: colors.surface,
    },
    backButton: {
        padding: spacing.xs,
    },
    backIcon: {
        fontSize: 24,
        color: colors.textPrimary,
    },
    headerTitleContainer: {
        flex: 1,
        marginHorizontal: spacing.md,
    },
    headerTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
    },
    connectionBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.completedBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectionDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.completed,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl * 2,
    },
    studentCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    studentInfo: {
        flex: 1,
    },
    studentLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    studentName: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    projectName: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    studentAvatar: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.md,
        backgroundColor: colors.inProgressBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: {
        fontSize: 32,
    },
    rubricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    rubricTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
    },
    rubricCount: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    criterionCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.md,
    },
    criterionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    criterionName: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        flex: 1,
        marginRight: spacing.sm,
    },
    scoreBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreBadgeText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
    criterionDescription: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        lineHeight: 20,
    },
    sliderSection: {
        marginBottom: spacing.md,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    sliderLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    sliderValue: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
    },
    sliderContainer: {
        marginBottom: spacing.sm,
    },
    sliderTrack: {
        height: 8,
        backgroundColor: colors.inputBorder,
        borderRadius: 4,
        position: 'relative',
    },
    sliderFill: {
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    sliderThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        position: 'absolute',
        top: -6,
        marginLeft: -10,
        borderWidth: 3,
        borderColor: colors.white,
        ...shadows.md,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    sliderMinMax: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    scoreButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
    },
    scoreButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.inputBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreButtonText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    justificationSection: {
        borderTopWidth: 1,
        borderTopColor: colors.inputBorder,
        paddingTop: spacing.md,
    },
    justificationLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    justificationInput: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        minHeight: 80,
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    justificationInputError: {
        borderColor: colors.error,
        backgroundColor: colors.errorBg,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    warningIcon: {
        fontSize: 14,
        marginRight: spacing.xs,
    },
    warningText: {
        fontSize: fontSize.xs,
        color: colors.error,
    },
    finishButton: {
        marginTop: spacing.lg,
    },
    draftBanner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.completedBg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
    },
    draftIcon: {
        fontSize: 14,
        color: colors.completed,
        marginRight: spacing.xs,
    },
    draftText: {
        fontSize: fontSize.sm,
        color: colors.completed,
        fontWeight: fontWeight.medium,
    },
});

export default EvaluacionScreen;
