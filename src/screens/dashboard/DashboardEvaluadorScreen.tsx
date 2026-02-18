import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { StatusBadge } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Project, ProjectStatus } from '../../types';

type DashboardEvaluadorScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'DashboardEvaluador'>;
};

// Mock data for demo
const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Alpha Devs',
        description: 'E-commerce API',
        team: [{ id: '1', name: 'Juan', avatar: '' }],
        status: 'pendiente',
        progress: 0,
        lastUpdated: 'Hace 2 horas',
        evidences: [],
    },
    {
        id: '2',
        name: 'Beta Squad',
        description: 'Machine Learning Model',
        team: [{ id: '2', name: 'María', avatar: '' }],
        status: 'en_progreso',
        progress: 50,
        lastUpdated: 'Hace 1 hora',
        evidences: [],
    },
    {
        id: '3',
        name: 'Gamma Group',
        description: 'Mobile Banking App',
        team: [{ id: '3', name: 'Carlos', avatar: '' }],
        status: 'completado',
        progress: 100,
        lastUpdated: 'Hace 3 días',
        evidences: [],
        finalScore: 9.5,
    },
    {
        id: '4',
        name: 'Delta Force',
        description: 'Unity Game Prototype',
        team: [{ id: '4', name: 'Ana', avatar: '' }],
        status: 'completado',
        progress: 100,
        lastUpdated: 'Hace 1 semana',
        evidences: [],
        finalScore: 8.8,
    },
    {
        id: '5',
        name: 'Omega Team',
        description: 'IoT Home System',
        team: [{ id: '5', name: 'Luis', avatar: '' }],
        status: 'pendiente',
        progress: 0,
        lastUpdated: 'Hace 5 minutos',
        evidences: [],
    },
];

type TabType = 'todos' | 'pendientes' | 'completados';

export const DashboardEvaluadorScreen: React.FC<DashboardEvaluadorScreenProps> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<TabType>('todos');
    const pendingCount = mockProjects.filter(p => p.status === 'pendiente' || p.status === 'en_progreso').length;

    const filteredProjects = mockProjects.filter(project => {
        if (activeTab === 'todos') return true;
        if (activeTab === 'pendientes') return project.status === 'pendiente' || project.status === 'en_progreso';
        if (activeTab === 'completados') return project.status === 'completado';
        return true;
    });

    const getProgressSteps = (status: ProjectStatus, progress: number) => {
        const steps = ['Inicio', 'Feedback', 'Final'];
        let activeStep = 0;
        if (status === 'en_progreso') activeStep = 1;
        if (status === 'completado') activeStep = 2;

        return steps.map((step, index) => ({
            label: step,
            isActive: index <= activeStep,
            isCurrent: index === activeStep,
        }));
    };

    const handleProjectPress = (project: Project) => {
        if (project.status === 'completado') {
            navigation.navigate('ResumenEvaluacion', { evaluationId: project.id });
        } else {
            navigation.navigate('Evaluacion', { projectId: project.id });
        }
    };

    const renderProjectCard = (project: Project) => {
        const steps = getProgressSteps(project.status, project.progress);
        const isCompleted = project.status === 'completado';

        return (
            <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => handleProjectPress(project)}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.teamAvatar}>
                        <Text style={styles.avatarText}>{project.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.projectName}>{project.name}</Text>
                        <Text style={styles.projectDescription}>{project.description}</Text>
                    </View>
                    <StatusBadge status={project.status} />
                </View>

                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>PROGRESO DE EVALUACIÓN</Text>
                        <Text style={styles.progressPercent}>{project.progress}%</Text>
                    </View>

                    <View style={styles.progressTrack}>
                        {steps.map((step, index) => (
                            <React.Fragment key={step.label}>
                                <View style={[
                                    styles.progressDot,
                                    step.isActive && styles.progressDotActive,
                                    step.isCurrent && styles.progressDotCurrent,
                                ]}>
                                    {isCompleted && index === steps.length - 1 && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </View>
                                {index < steps.length - 1 && (
                                    <View style={[
                                        styles.progressLine,
                                        step.isActive && styles.progressLineActive,
                                    ]} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>

                    <View style={styles.stepLabels}>
                        {steps.map((step) => (
                            <Text
                                key={step.label}
                                style={[styles.stepLabel, step.isActive && styles.stepLabelActive]}
                            >
                                {step.label}
                            </Text>
                        ))}
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.timeInfo}>
                        <Text style={styles.timeIcon}>🕐</Text>
                        <Text style={styles.timeText}>{project.lastUpdated}</Text>
                    </View>

                    {isCompleted ? (
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreValue}>{project.finalScore}</Text>
                            <Text style={styles.scoreMax}>/10</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleProjectPress(project)}
                        >
                            <Text style={styles.actionText}>
                                {project.status === 'pendiente' ? 'Evaluar ahora' : 'Continuar'}
                            </Text>
                            <Text style={styles.actionArrow}>→</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoSmall}>
                        <Text style={styles.logoIcon}>⚖</Text>
                    </View>
                    <Text style={styles.headerTitle}>CodeJury</Text>
                </View>
                <View style={styles.connectionBadge}>
                    <View style={styles.connectionDot} />
                    <Text style={styles.connectionText}>Conectado</Text>
                </View>
            </View>

            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Hola, Evaluador</Text>
                <Text style={styles.welcomeSubtitle}>
                    Tienes <Text style={styles.highlightText}>{pendingCount} evaluaciones</Text> en curso.
                </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                {(['todos', 'pendientes', 'completados'] as TabType[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Projects List */}
            <ScrollView
                style={styles.projectsList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.projectsContent}
            >
                {filteredProjects.map(renderProjectCard)}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <Text style={styles.fabIcon}>🔄</Text>
            </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoSmall: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryLight + '40',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    logoIcon: {
        fontSize: 18,
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    connectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.completedBg,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    connectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.completed,
        marginRight: spacing.xs,
    },
    connectionText: {
        fontSize: fontSize.xs,
        color: colors.completed,
        fontWeight: fontWeight.medium,
    },
    welcomeSection: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    welcomeTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    welcomeSubtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    highlightText: {
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    tab: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    tabActive: {
        backgroundColor: colors.textPrimary,
        borderColor: colors.textPrimary,
    },
    tabText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.white,
    },
    projectsList: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    projectsContent: {
        paddingBottom: spacing.xxl * 2,
    },
    projectCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: colors.primaryLight,
        ...shadows.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    teamAvatar: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.inProgressBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    avatarText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.inProgress,
    },
    cardInfo: {
        flex: 1,
    },
    projectName: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
    },
    projectDescription: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    progressSection: {
        marginBottom: spacing.md,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    progressLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    progressPercent: {
        fontSize: fontSize.xs,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    progressTrack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.inputBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressDotActive: {
        backgroundColor: colors.primary,
    },
    progressDotCurrent: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    progressLine: {
        flex: 1,
        height: 2,
        backgroundColor: colors.inputBorder,
        marginHorizontal: spacing.xs,
    },
    progressLineActive: {
        backgroundColor: colors.primary,
    },
    checkmark: {
        color: colors.white,
        fontSize: 10,
        fontWeight: fontWeight.bold,
    },
    stepLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stepLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    stepLabelActive: {
        color: colors.primary,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeIcon: {
        fontSize: 14,
        marginRight: spacing.xs,
    },
    timeText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    scoreValue: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    scoreMax: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
        marginRight: spacing.xs,
    },
    actionArrow: {
        fontSize: fontSize.md,
        color: colors.primary,
    },
    fab: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.lg,
    },
    fabIcon: {
        fontSize: 24,
    },
});

export default DashboardEvaluadorScreen;
