import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors, borderRadius, fontSize, fontWeight, spacing } from '../../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
}) => {
    const getButtonStyle = (): ViewStyle => {
        const base: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: borderRadius.xl,
        };

        // Size styles
        switch (size) {
            case 'sm':
                base.paddingVertical = spacing.sm;
                base.paddingHorizontal = spacing.md;
                break;
            case 'lg':
                base.paddingVertical = spacing.lg;
                base.paddingHorizontal = spacing.xl;
                break;
            default:
                base.paddingVertical = spacing.md;
                base.paddingHorizontal = spacing.lg;
        }

        // Variant styles
        switch (variant) {
            case 'secondary':
                base.backgroundColor = colors.primaryLight;
                break;
            case 'outline':
                base.backgroundColor = 'transparent';
                base.borderWidth = 2;
                base.borderColor = colors.primary;
                break;
            default:
                base.backgroundColor = colors.primary;
        }

        if (disabled) {
            base.opacity = 0.5;
        }

        return base;
    };

    const getTextStyle = (): TextStyle => {
        const base: TextStyle = {
            fontWeight: fontWeight.semibold,
        };

        switch (size) {
            case 'sm':
                base.fontSize = fontSize.sm;
                break;
            case 'lg':
                base.fontSize = fontSize.lg;
                break;
            default:
                base.fontSize = fontSize.md;
        }

        switch (variant) {
            case 'outline':
                base.color = colors.primary;
                break;
            default:
                base.color = colors.white;
        }

        return base;
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text style={[getTextStyle(), icon ? { marginLeft: spacing.sm } : undefined, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;
