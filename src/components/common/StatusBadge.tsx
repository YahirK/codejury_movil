import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, fontSize, fontWeight, spacing } from '../../theme';
import { ProjectStatus } from '../../types';

interface StatusBadgeProps {
    status: ProjectStatus;
    style?: ViewStyle;
}

const statusConfig: Record<ProjectStatus, { label: string; bgColor: string; textColor: string }> = {
    pendiente: {
        label: 'PENDIENTE',
        bgColor: colors.pendingBg,
        textColor: colors.pending,
    },
    en_progreso: {
        label: 'EN PROGRESO',
        bgColor: colors.inProgressBg,
        textColor: colors.inProgress,
    },
    completado: {
        label: 'COMPLETADO',
        bgColor: colors.completedBg,
        textColor: colors.completed,
    },
    entregado: {
        label: 'ENTREGADO',
        bgColor: colors.inProgressBg,
        textColor: colors.inProgress,
    },
    en_revision: {
        label: 'EN REVISIÓN',
        bgColor: colors.inReviewBg,
        textColor: colors.inReview,
    },
    calificado: {
        label: 'CALIFICADO',
        bgColor: colors.completedBg,
        textColor: colors.completed,
    },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
    const config = statusConfig[status];

    return (
        <View style={[styles.badge, { backgroundColor: config.bgColor }, style]}>
            <Text style={[styles.text, { color: config.textColor }]}>{config.label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    text: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
    },
});

export default StatusBadge;
