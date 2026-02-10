import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { Button, StatusBadge } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Project, ProjectStatus } from '../../types';

type DashboardAdminScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'DashboardAdmin'>;
};

// Mock projects 
const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Alpha Devs',
        description: 'E-commerce API',
        team: [{ id: '1', name: 'Juan Pérez' }, { id: '2', name: 'María López' }],
        status: 'pendiente',
        progress: 0,
        lastUpdated: 'Hace 2 horas',
        evidences: [],
    },
    {
        id: '2',
        name: 'Beta Squad',
        description: 'Machine Learning Model',
        team: [{ id: '3', name: 'Carlos Ruiz' }],
        status: 'en_progreso',
        progress: 50,
        lastUpdated: 'Hace 1 hora',
        evidences: [],
    },
    {
        id: '3',
        name: 'Gamma Group',
        description: 'Mobile Banking App',
        team: [{ id: '4', name: 'Ana Torres' }, { id: '5', name: 'Luis García' }],
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
        team: [{ id: '6', name: 'Pedro Sánchez' }],
        status: 'en_revision',
        progress: 75,
        lastUpdated: 'Hace 1 día',
        evidences: [],
    },
];

type TabType = 'todos' | 'activos' | 'completados';

export const DashboardAdminScreen: React.FC<DashboardAdminScreenProps> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<TabType>('todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewProject, setShowNewProject] = useState(false);

    const filteredProjects = mockProjects
        .filter(p => {
            if (activeTab === 'activos') return p.status !== 'completado';
            if (activeTab === 'completados') return p.status === 'completado';
            return true;
        })
        .filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const stats = {
        total: mockProjects.length,
        active: mockProjects.filter(p => p.status !== 'completado').length,
        completed: mockProjects.filter(p => p.status === 'completado').length,
        avgScore: mockProjects
            .filter(p => p.finalScore)
            .reduce((sum, p) => sum + (p.finalScore || 0), 0) /
            (mockProjects.filter(p => p.finalScore).length || 1),
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoSmall}>
                        <Text style={styles.logoIcon}>⚖</Text>
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Panel Admin</Text>
                        <Text style={styles.headerSubtitle}>Gestión de Proyectos</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.settingsButton}>
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Stats Overview */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
                        <Text style={styles.statValue}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: colors.pending }]}>
                        <Text style={styles.statValue}>{stats.active}</Text>
                        <Text style={styles.statLabel}>Activos</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: colors.completed }]}>
                        <Text style={styles.statValue}>{stats.completed}</Text>
                        <Text style={styles.statLabel}>Completados</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: colors.inProgress }]}>
                        <Text style={styles.statValue}>{stats.avgScore.toFixed(1)}</Text>
                        <Text style={styles.statLabel}>Promedio</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar proyecto..."
                        placeholderTextColor={colors.placeholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {(['todos', 'activos', 'completados'] as TabType[]).map((tab) => (
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

                {/* Projects */}
                {filteredProjects.map((project) => (
                    <View key={project.id} style={styles.projectCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.projectAvatar}>
                                <Text style={styles.projectAvatarText}>{project.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.projectName}>{project.name}</Text>
                                <Text style={styles.projectDescription}>{project.description}</Text>
                            </View>
                            <StatusBadge status={project.status} />
                        </View>

                        {/* Team Members */}
                        <View style={styles.teamSection}>
                            <Text style={styles.teamLabel}>EQUIPO</Text>
                            <View style={styles.teamMembers}>
                                {project.team.map((member, i) => (
                                    <View key={member.id} style={styles.memberBadge}>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.cardActions}>
                            <Text style={styles.timeText}>🕐 {project.lastUpdated}</Text>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.editButton}>
                                    <Text style={styles.editText}>✏️ Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton}>
                                    <Text style={styles.deleteText}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {filteredProjects.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyTitle}>No se encontraron proyectos</Text>
                        <Text style={styles.emptyText}>Intenta con otro término de búsqueda</Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB - New Project */}
            <TouchableOpacity style={styles.fab} onPress={() => setShowNewProject(true)}>
                <Text style={styles.fabIcon}>+</Text>
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
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoSmall: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryLight + '40',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    logoIcon: {
        fontSize: 20,
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl * 2,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderLeftWidth: 4,
        ...shadows.sm,
    },
    statValue: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: spacing.sm,
        fontSize: fontSize.md,
        color: colors.textPrimary,
    },
    clearIcon: {
        fontSize: 14,
        color: colors.textSecondary,
        padding: spacing.xs,
    },
    tabsContainer: {
        flexDirection: 'row',
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
    projectCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    projectAvatar: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primaryLight + '40',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    projectAvatarText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.primary,
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
    teamSection: {
        marginBottom: spacing.md,
    },
    teamLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
        marginBottom: spacing.xs,
    },
    teamMembers: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    memberBadge: {
        backgroundColor: colors.primaryLight + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    memberName: {
        fontSize: fontSize.xs,
        color: colors.primary,
        fontWeight: fontWeight.medium,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.inputBorder,
        paddingTop: spacing.sm,
    },
    timeText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    editButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryLight + '20',
    },
    editText: {
        fontSize: fontSize.xs,
        color: colors.primary,
        fontWeight: fontWeight.medium,
    },
    deleteButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.errorBg,
    },
    deleteText: {
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    emptyText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
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
        fontSize: 28,
        color: colors.white,
        fontWeight: fontWeight.bold,
        lineHeight: 30,
    },
});

export default DashboardAdminScreen;
