import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { Button } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Evidence } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RevisionArchivosScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'RevisionArchivos'>;
    route: RouteProp<RootStackParamList, 'RevisionArchivos'>;
};

// Mock evidences
const mockEvidences: Evidence[] = [
    { id: '1', type: 'document', name: 'Documentación Técnica.pdf', size: '2.4 MB', isOfflineAvailable: true },
    { id: '2', type: 'document', name: 'Manual de Usuario.pdf', size: '1.8 MB', isOfflineAvailable: true },
    { id: '3', type: 'image', name: 'Diagrama de Arquitectura.png', size: '856 KB', isOfflineAvailable: false },
    { id: '4', type: 'image', name: 'Captura UI Principal.png', size: '1.2 MB', isOfflineAvailable: true },
    { id: '5', type: 'video', name: 'Demo del Sistema.mp4', size: '45.2 MB', isOfflineAvailable: false },
    { id: '6', type: 'link', name: 'Repositorio GitHub', url: 'https://github.com/example', isOfflineAvailable: false },
];

const getTypeIcon = (type: Evidence['type']): string => {
    switch (type) {
        case 'document': return '📄';
        case 'image': return '🖼️';
        case 'video': return '🎬';
        case 'link': return '🔗';
        default: return '📁';
    }
};

const getTypeColor = (type: Evidence['type']): string => {
    switch (type) {
        case 'document': return colors.inProgress;
        case 'image': return colors.completed;
        case 'video': return colors.inReview;
        case 'link': return colors.primary;
        default: return colors.textSecondary;
    }
};

export const RevisionArchivosScreen: React.FC<RevisionArchivosScreenProps> = ({ navigation, route }) => {
    const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = mockEvidences.length;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
            setSelectedEvidence(mockEvidences[currentStep]);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setSelectedEvidence(mockEvidences[currentStep - 2]);
        }
    };

    const handleConfirmReview = () => {
        navigation.goBack();
    };

    const renderEvidencePreview = () => {
        const evidence = selectedEvidence || mockEvidences[0];

        return (
            <View style={styles.previewContainer}>
                <View style={styles.previewHeader}>
                    <Text style={styles.previewStep}>
                        Evidencia {currentStep} de {totalSteps}
                    </Text>
                    <View style={styles.previewBadge}>
                        <Text style={styles.previewBadgeText}>{evidence.type.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={[styles.previewArea, { borderColor: getTypeColor(evidence.type) }]}>
                    <Text style={styles.previewIcon}>{getTypeIcon(evidence.type)}</Text>
                    <Text style={styles.previewFileName}>{evidence.name}</Text>
                    {evidence.size && (
                        <Text style={styles.previewFileSize}>{evidence.size}</Text>
                    )}

                    {evidence.type === 'image' && (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imagePlaceholderText}>Vista previa de imagen</Text>
                            <Text style={styles.imagePlaceholderIcon}>🖼️</Text>
                        </View>
                    )}

                    {evidence.type === 'video' && (
                        <View style={styles.videoPlaceholder}>
                            <View style={styles.playButton}>
                                <Text style={styles.playIcon}>▶</Text>
                            </View>
                            <Text style={styles.videoText}>Toca para reproducir</Text>
                        </View>
                    )}

                    {evidence.type === 'document' && (
                        <View style={styles.documentPreview}>
                            <View style={styles.docLine} />
                            <View style={[styles.docLine, { width: '80%' }]} />
                            <View style={[styles.docLine, { width: '60%' }]} />
                            <View style={[styles.docLine, { width: '90%' }]} />
                            <View style={[styles.docLine, { width: '70%' }]} />
                        </View>
                    )}

                    {evidence.type === 'link' && (
                        <View style={styles.linkPreview}>
                            <Text style={styles.linkUrl}>{evidence.url}</Text>
                            <TouchableOpacity style={styles.openLinkButton}>
                                <Text style={styles.openLinkText}>Abrir enlace ↗</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Offline badge */}
                <View style={[
                    styles.offlineBadge,
                    { backgroundColor: evidence.isOfflineAvailable ? colors.completedBg : colors.pendingBg }
                ]}>
                    <Text style={styles.offlineIcon}>
                        {evidence.isOfflineAvailable ? '✅' : '☁️'}
                    </Text>
                    <Text style={[
                        styles.offlineText,
                        { color: evidence.isOfflineAvailable ? colors.completed : colors.pending }
                    ]}>
                        {evidence.isOfflineAvailable ? 'Disponible offline' : 'Requiere conexión'}
                    </Text>
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
                <Text style={styles.headerTitle}>Revisión de Evidencias</Text>
                <View style={styles.stepCounter}>
                    <Text style={styles.stepCounterText}>{currentStep}/{totalSteps}</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Guidance Text */}
                <View style={styles.guidanceCard}>
                    <Text style={styles.guidanceIcon}>💡</Text>
                    <View style={styles.guidanceTextContainer}>
                        <Text style={styles.guidanceTitle}>Guía de revisión</Text>
                        <Text style={styles.guidanceText}>
                            Revisa cada evidencia detenidamente. Verifica que el contenido sea coherente
                            con lo descrito en la documentación del proyecto.
                        </Text>
                    </View>
                </View>

                {/* Evidence Preview */}
                {renderEvidencePreview()}

                {/* Evidence List */}
                <Text style={styles.listTitle}>Todas las evidencias</Text>
                {mockEvidences.map((evidence, index) => (
                    <TouchableOpacity
                        key={evidence.id}
                        style={[
                            styles.evidenceItem,
                            index + 1 === currentStep && styles.evidenceItemActive,
                        ]}
                        onPress={() => {
                            setCurrentStep(index + 1);
                            setSelectedEvidence(evidence);
                        }}
                    >
                        <View style={[styles.evidenceIcon, { backgroundColor: getTypeColor(evidence.type) + '20' }]}>
                            <Text style={styles.evidenceIconText}>{getTypeIcon(evidence.type)}</Text>
                        </View>
                        <View style={styles.evidenceInfo}>
                            <Text style={styles.evidenceName}>{evidence.name}</Text>
                            {evidence.size && <Text style={styles.evidenceSize}>{evidence.size}</Text>}
                        </View>
                        {index + 1 === currentStep && (
                            <View style={styles.activeDot} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={[styles.navButton, currentStep === 1 && styles.navButtonDisabled]}
                    onPress={handlePrevious}
                    disabled={currentStep === 1}
                >
                    <Text style={[styles.navButtonText, currentStep === 1 && styles.navButtonTextDisabled]}>
                        ← Anterior
                    </Text>
                </TouchableOpacity>

                {currentStep === totalSteps ? (
                    <Button
                        title="Confirmar Revisión ✓"
                        onPress={handleConfirmReview}
                        size="md"
                    />
                ) : (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Siguiente →</Text>
                    </TouchableOpacity>
                )}
            </View>
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
    stepCounter: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    stepCounterText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.inputBorder,
    },
    progressFill: {
        height: 4,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl * 2,
    },
    guidanceCard: {
        flexDirection: 'row',
        backgroundColor: colors.primaryLight + '20',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    guidanceIcon: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    guidanceTextContainer: {
        flex: 1,
    },
    guidanceTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    guidanceText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    previewContainer: {
        marginBottom: spacing.lg,
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    previewStep: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
    },
    previewBadge: {
        backgroundColor: colors.primaryLight + '30',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    previewBadgeText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.primary,
    },
    previewArea: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        minHeight: 200,
        justifyContent: 'center',
        borderWidth: 2,
        ...shadows.md,
    },
    previewIcon: {
        fontSize: 48,
        marginBottom: spacing.sm,
    },
    previewFileName: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    previewFileSize: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    imagePlaceholder: {
        marginTop: spacing.md,
        alignItems: 'center',
    },
    imagePlaceholderText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    imagePlaceholderIcon: {
        fontSize: 64,
    },
    videoPlaceholder: {
        marginTop: spacing.md,
        alignItems: 'center',
    },
    playButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.inReview,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    playIcon: {
        fontSize: 24,
        color: colors.white,
        marginLeft: 4,
    },
    videoText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    documentPreview: {
        marginTop: spacing.md,
        width: '100%',
        gap: 8,
    },
    docLine: {
        height: 8,
        backgroundColor: colors.inputBorder,
        borderRadius: 4,
        width: '100%',
    },
    linkPreview: {
        marginTop: spacing.md,
        alignItems: 'center',
    },
    linkUrl: {
        fontSize: fontSize.sm,
        color: colors.primary,
        marginBottom: spacing.sm,
    },
    openLinkButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    openLinkText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.white,
    },
    offlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        marginTop: spacing.sm,
    },
    offlineIcon: {
        fontSize: 14,
        marginRight: spacing.xs,
    },
    offlineText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
    },
    listTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    evidenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    evidenceItemActive: {
        borderWidth: 2,
        borderColor: colors.primary,
    },
    evidenceIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    evidenceIconText: {
        fontSize: 20,
    },
    evidenceInfo: {
        flex: 1,
    },
    evidenceName: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textPrimary,
    },
    evidenceSize: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.inputBorder,
    },
    navButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    navButtonDisabled: {
        opacity: 0.4,
    },
    navButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.primary,
    },
    navButtonTextDisabled: {
        color: colors.textSecondary,
    },
    nextButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
    },
    nextButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.white,
    },
});

export default RevisionArchivosScreen;
