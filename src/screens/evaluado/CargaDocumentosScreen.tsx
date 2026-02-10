import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { Button } from '../../components/common';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type CargaDocumentosScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'CargaDocumentos'>;
    route: RouteProp<RootStackParamList, 'CargaDocumentos'>;
};

interface UploadFile {
    id: string;
    name: string;
    size: string;
    type: string;
    progress: number;
    status: 'pending' | 'uploading' | 'done' | 'error';
}

export const CargaDocumentosScreen: React.FC<CargaDocumentosScreenProps> = ({ navigation, route }) => {
    const [files, setFiles] = useState<UploadFile[]>([
        { id: '1', name: 'Documentación_Técnica.pdf', size: '2.4 MB', type: 'document', progress: 100, status: 'done' },
        { id: '2', name: 'Manual_Usuario.pdf', size: '1.8 MB', type: 'document', progress: 100, status: 'done' },
        { id: '3', name: 'Diagrama_Arquitectura.png', size: '856 KB', type: 'image', progress: 65, status: 'uploading' },
    ]);

    const getTypeIcon = (type: string): string => {
        switch (type) {
            case 'document': return '📄';
            case 'image': return '🖼️';
            case 'video': return '🎬';
            default: return '📁';
        }
    };

    const getStatusColor = (status: UploadFile['status']) => {
        switch (status) {
            case 'done': return colors.completed;
            case 'uploading': return colors.primary;
            case 'error': return colors.error;
            default: return colors.textSecondary;
        }
    };

    const handleAddFile = () => {
        const newFile: UploadFile = {
            id: String(files.length + 1),
            name: `Nuevo_Archivo_${files.length + 1}.pdf`,
            size: '1.2 MB',
            type: 'document',
            progress: 0,
            status: 'pending',
        };
        setFiles(prev => [...prev, newFile]);
    };

    const handleRemoveFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleSubmit = () => {
        const totalSize = '5.1 MB';
        navigation.navigate('ConfirmacionCarga', {
            filesCount: files.length,
            totalSize
        });
    };

    const completedFiles = files.filter(f => f.status === 'done').length;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Carga de Documentos</Text>
                <View style={styles.counterBadge}>
                    <Text style={styles.counterText}>{files.length}</Text>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Instructions */}
                <View style={styles.instructionsCard}>
                    <Text style={styles.instructionsIcon}>📋</Text>
                    <View style={styles.instructionsContent}>
                        <Text style={styles.instructionsTitle}>Instrucciones</Text>
                        <Text style={styles.instructionsText}>
                            Sube todas las evidencias de tu proyecto: documentación, capturas,
                            videos demostrativos y enlaces relevantes.
                        </Text>
                    </View>
                </View>

                {/* Upload Area */}
                <TouchableOpacity style={styles.uploadArea} onPress={handleAddFile} activeOpacity={0.7}>
                    <View style={styles.uploadIconContainer}>
                        <Text style={styles.uploadIcon}>☁️</Text>
                    </View>
                    <Text style={styles.uploadTitle}>Arrastra o toca para subir</Text>
                    <Text style={styles.uploadSubtitle}>PDF, PNG, JPG, MP4 (máx 50MB)</Text>
                </TouchableOpacity>

                {/* Progress Summary */}
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                        {completedFiles} de {files.length} archivos listos
                    </Text>
                    <View style={styles.summaryBar}>
                        <View style={[styles.summaryBarFill, {
                            width: files.length > 0 ? `${(completedFiles / files.length) * 100}%` : '0%'
                        }]} />
                    </View>
                </View>

                {/* File List */}
                <Text style={styles.sectionTitle}>Archivos ({files.length})</Text>

                {files.map((file) => (
                    <View key={file.id} style={styles.fileCard}>
                        <View style={styles.fileHeader}>
                            <View style={[styles.fileIcon, { backgroundColor: getStatusColor(file.status) + '20' }]}>
                                <Text style={styles.fileIconText}>{getTypeIcon(file.type)}</Text>
                            </View>
                            <View style={styles.fileInfo}>
                                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                                <Text style={styles.fileSize}>{file.size}</Text>
                            </View>
                            {file.status === 'done' ? (
                                <View style={styles.doneIcon}>
                                    <Text style={styles.doneIconText}>✓</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveFile(file.id)}
                                >
                                    <Text style={styles.removeIcon}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {file.status === 'uploading' && (
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: `${file.progress}%` }]} />
                                </View>
                                <Text style={styles.progressText}>{file.progress}%</Text>
                            </View>
                        )}
                    </View>
                ))}

                {/* Add more */}
                <TouchableOpacity style={styles.addMoreButton} onPress={handleAddFile}>
                    <Text style={styles.addMoreIcon}>+</Text>
                    <Text style={styles.addMoreText}>Agregar más archivos</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomInfo}>
                    <Text style={styles.bottomCount}>{files.length} archivos</Text>
                    <Text style={styles.bottomSize}>5.1 MB total</Text>
                </View>
                <Button
                    title="Enviar Evidencias"
                    onPress={handleSubmit}
                    size="md"
                    disabled={files.length === 0}
                />
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
    counterBadge: {
        backgroundColor: colors.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.white,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl * 2,
    },
    instructionsCard: {
        flexDirection: 'row',
        backgroundColor: colors.primaryLight + '20',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    instructionsIcon: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    instructionsContent: {
        flex: 1,
    },
    instructionsTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    instructionsText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    uploadArea: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        backgroundColor: colors.primaryLight + '10',
    },
    uploadIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primaryLight + '30',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    uploadIcon: {
        fontSize: 32,
    },
    uploadTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    uploadSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    summaryRow: {
        marginBottom: spacing.lg,
    },
    summaryLabel: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    summaryBar: {
        height: 6,
        backgroundColor: colors.inputBorder,
        borderRadius: 3,
    },
    summaryBarFill: {
        height: 6,
        backgroundColor: colors.completed,
        borderRadius: 3,
    },
    sectionTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    fileCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    fileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    fileIconText: {
        fontSize: 20,
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textPrimary,
    },
    fileSize: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    doneIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.completed,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneIconText: {
        fontSize: 14,
        color: colors.white,
        fontWeight: fontWeight.bold,
    },
    removeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.errorBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeIcon: {
        fontSize: 12,
        color: colors.error,
        fontWeight: fontWeight.bold,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: colors.inputBorder,
        borderRadius: 2,
        marginRight: spacing.sm,
    },
    progressFill: {
        height: 4,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    progressText: {
        fontSize: fontSize.xs,
        color: colors.primary,
        fontWeight: fontWeight.medium,
        width: 36,
        textAlign: 'right',
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        marginTop: spacing.sm,
    },
    addMoreIcon: {
        fontSize: 20,
        color: colors.primary,
        marginRight: spacing.sm,
    },
    addMoreText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.primary,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.inputBorder,
    },
    bottomInfo: {},
    bottomCount: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
    },
    bottomSize: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
});

export default CargaDocumentosScreen;
