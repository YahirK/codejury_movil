import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { Button } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ResumenEvaluacionScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ResumenEvaluacion'>;
    route: RouteProp<RootStackParamList, 'ResumenEvaluacion'>;
};

// Mock evaluation results
const mockResults = {
    studentName: 'Juan Pérez',
    projectName: 'Sistema de Gestión de Inventario',
    finalScore: 8.5,
    criteria: [
        { name: 'Código', shortName: 'COD', score: 9, maxScore: 10 },
        { name: 'Funcionalidad', shortName: 'FUN', score: 8, maxScore: 10 },
        { name: 'UX/UI', shortName: 'UX', score: 7, maxScore: 10 },
        { name: 'Documentación', shortName: 'DOC', score: 9, maxScore: 10 },
        { name: 'Innovación', shortName: 'INN', score: 8.5, maxScore: 10 },
    ],
    evaluatedAt: '09 Feb 2026, 23:30',
    syncStatus: 'synced' as const,
};

// Radar chart component
const CHART_SIZE = SCREEN_WIDTH - spacing.lg * 4;
const CHART_CENTER = CHART_SIZE / 2;
const CHART_RADIUS = CHART_SIZE / 2 - 30;

const RadarChart: React.FC<{ data: typeof mockResults.criteria }> = ({ data }) => {
    const numAxes = data.length;
    const angleStep = (2 * Math.PI) / numAxes;

    const getPoint = (index: number, value: number, maxValue: number) => {
        const angle = index * angleStep - Math.PI / 2;
        const radius = (value / maxValue) * CHART_RADIUS;
        return {
            x: CHART_CENTER + radius * Math.cos(angle),
            y: CHART_CENTER + radius * Math.sin(angle),
        };
    };

    // Grid lines
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

    const gridPolygons = gridLevels.map((level) => {
        const points = data.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const radius = level * CHART_RADIUS;
            return `${CHART_CENTER + radius * Math.cos(angle)},${CHART_CENTER + radius * Math.sin(angle)}`;
        }).join(' ');
        return points;
    });

    // Data polygon
    const dataPoints = data.map((item, i) => {
        const point = getPoint(i, item.score, item.maxScore);
        return `${point.x},${point.y}`;
    }).join(' ');

    // Axis labels
    const labelPoints = data.map((item, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = CHART_RADIUS + 20;
        return {
            x: CHART_CENTER + labelRadius * Math.cos(angle),
            y: CHART_CENTER + labelRadius * Math.sin(angle),
            label: item.shortName,
            score: item.score,
        };
    });

    return (
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
            {/* Grid polygons */}
            {gridPolygons.map((points, i) => (
                <Polygon
                    key={`grid-${i}`}
                    points={points}
                    fill="none"
                    stroke={colors.inputBorder}
                    strokeWidth={1}
                    opacity={0.5}
                />
            ))}

            {/* Axis lines */}
            {data.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const endX = CHART_CENTER + CHART_RADIUS * Math.cos(angle);
                const endY = CHART_CENTER + CHART_RADIUS * Math.sin(angle);
                return (
                    <Line
                        key={`axis-${i}`}
                        x1={CHART_CENTER}
                        y1={CHART_CENTER}
                        x2={endX}
                        y2={endY}
                        stroke={colors.inputBorder}
                        strokeWidth={1}
                        opacity={0.5}
                    />
                );
            })}

            {/* Data polygon */}
            <Polygon
                points={dataPoints}
                fill={colors.primary}
                fillOpacity={0.2}
                stroke={colors.primary}
                strokeWidth={2}
            />

            {/* Data points */}
            {data.map((item, i) => {
                const point = getPoint(i, item.score, item.maxScore);
                return (
                    <Circle
                        key={`point-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r={4}
                        fill={colors.primary}
                    />
                );
            })}

            {/* Labels */}
            {labelPoints.map((point, i) => (
                <G key={`label-${i}`}>
                    <SvgText
                        x={point.x}
                        y={point.y - 6}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight="600"
                        fill={colors.textPrimary}
                    >
                        {point.label}
                    </SvgText>
                    <SvgText
                        x={point.x}
                        y={point.y + 8}
                        textAnchor="middle"
                        fontSize={10}
                        fill={colors.primary}
                    >
                        {point.score}
                    </SvgText>
                </G>
            ))}
        </Svg>
    );
};

const getScoreColor = (score: number): string => {
    if (score >= 9) return colors.completed;
    if (score >= 7) return colors.primary;
    if (score >= 5) return colors.pending;
    return colors.error;
};

export const ResumenEvaluacionScreen: React.FC<ResumenEvaluacionScreenProps> = ({ navigation, route }) => {

    const handleGoBack = () => {
        navigation.popToTop();
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
                <Text style={styles.headerTitle}>Resumen de Evaluación</Text>
                <View style={styles.syncBadge}>
                    <Text style={styles.syncIcon}>✓</Text>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Student & Project */}
                <View style={styles.studentCard}>
                    <View style={styles.studentAvatar}>
                        <Text style={styles.avatarEmoji}>👨‍💻</Text>
                    </View>
                    <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{mockResults.studentName}</Text>
                        <Text style={styles.projectName}>{mockResults.projectName}</Text>
                    </View>
                </View>

                {/* Final Score */}
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>CALIFICACIÓN FINAL</Text>
                    <View style={styles.scoreCircle}>
                        <Text style={[styles.scoreValue, { color: getScoreColor(mockResults.finalScore) }]}>
                            {mockResults.finalScore}
                        </Text>
                        <Text style={styles.scoreMax}>/ 10</Text>
                    </View>
                    <View style={styles.scoreBar}>
                        <View style={[styles.scoreBarFill, {
                            width: `${mockResults.finalScore * 10}%`,
                            backgroundColor: getScoreColor(mockResults.finalScore),
                        }]} />
                    </View>
                </View>

                {/* Radar Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Perfil de Evaluación</Text>
                    <View style={styles.chartContainer}>
                        <RadarChart data={mockResults.criteria} />
                    </View>
                </View>

                {/* Criteria Breakdown */}
                <View style={styles.breakdownCard}>
                    <Text style={styles.breakdownTitle}>Desglose por Criterio</Text>
                    {mockResults.criteria.map((criterion, index) => (
                        <View key={index} style={styles.criterionRow}>
                            <View style={styles.criterionInfo}>
                                <Text style={styles.criterionName}>{criterion.name}</Text>
                                <Text style={[styles.criterionScore, { color: getScoreColor(criterion.score) }]}>
                                    {criterion.score}/{criterion.maxScore}
                                </Text>
                            </View>
                            <View style={styles.criterionBar}>
                                <View style={[styles.criterionBarFill, {
                                    width: `${(criterion.score / criterion.maxScore) * 100}%`,
                                    backgroundColor: getScoreColor(criterion.score),
                                }]} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Meta Info */}
                <View style={styles.metaCard}>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Fecha de evaluación</Text>
                        <Text style={styles.metaValue}>{mockResults.evaluatedAt}</Text>
                    </View>
                    <View style={styles.metaSeparator} />
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Estado de sincronización</Text>
                        <View style={styles.syncStatusBadge}>
                            <Text style={styles.syncStatusIcon}>✅</Text>
                            <Text style={styles.syncStatusText}>Sincronizado</Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <Button
                    title="Volver al Dashboard"
                    onPress={handleGoBack}
                    size="lg"
                    style={styles.backToDashboard}
                />
            </ScrollView>
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
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
    },
    backButton: {
        padding: spacing.xs,
    },
    backIcon: {
        fontSize: 24,
        color: colors.textPrimary,
    },
    headerTitle: {
        flex: 1,
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginLeft: spacing.sm,
    },
    syncBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.completedBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    syncIcon: {
        fontSize: 16,
        color: colors.completed,
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
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    studentAvatar: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        backgroundColor: colors.inProgressBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarEmoji: {
        fontSize: 28,
    },
    studentInfo: {
        flex: 1,
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
    scoreCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadows.md,
    },
    scoreLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
        marginBottom: spacing.md,
    },
    scoreCircle: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: spacing.md,
    },
    scoreValue: {
        fontSize: 56,
        fontWeight: fontWeight.bold,
    },
    scoreMax: {
        fontSize: fontSize.xl,
        color: colors.textSecondary,
        marginLeft: spacing.xs,
    },
    scoreBar: {
        width: '100%',
        height: 8,
        backgroundColor: colors.inputBorder,
        borderRadius: 4,
    },
    scoreBarFill: {
        height: 8,
        borderRadius: 4,
    },
    chartCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadows.md,
    },
    chartTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        alignSelf: 'flex-start',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    breakdownCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.md,
    },
    breakdownTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    criterionRow: {
        marginBottom: spacing.md,
    },
    criterionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    criterionName: {
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: fontWeight.medium,
    },
    criterionScore: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
    },
    criterionBar: {
        height: 6,
        backgroundColor: colors.inputBorder,
        borderRadius: 3,
    },
    criterionBarFill: {
        height: 6,
        borderRadius: 3,
    },
    metaCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    metaValue: {
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: fontWeight.medium,
    },
    metaSeparator: {
        height: 1,
        backgroundColor: colors.inputBorder,
        marginVertical: spacing.sm,
    },
    syncStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    syncStatusIcon: {
        fontSize: 14,
        marginRight: spacing.xs,
    },
    syncStatusText: {
        fontSize: fontSize.sm,
        color: colors.completed,
        fontWeight: fontWeight.medium,
    },
    backToDashboard: {
        marginTop: spacing.sm,
    },
});

export default ResumenEvaluacionScreen;
