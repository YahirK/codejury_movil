// User types
export type UserRole = 'administrador' | 'evaluador' | 'evaluado';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    // Evaluado specific
    specialty?: string;
    // Administrador/Evaluador specific
    employeeCode?: string;
    department?: string;
}

// Project types
export type ProjectStatus = 'entregado' | 'en_revision' | 'calificado' | 'pendiente' | 'en_progreso' | 'completado';

export interface TeamMember {
    id: string;
    name: string;
    avatar?: string;
}

export interface Evidence {
    id: string;
    type: 'document' | 'image' | 'video' | 'link';
    name: string;
    url?: string;
    size?: string;
    isOfflineAvailable?: boolean;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    team: TeamMember[];
    avatar?: string;
    status: ProjectStatus;
    progress: number;
    lastUpdated: string;
    evidences: Evidence[];
    finalScore?: number;
}

// Evaluation types
export interface RubricCriterion {
    id: string;
    name: string;
    description: string;
    score: number;
    justification: string;
    isJustificationRequired: boolean;
}

export interface RubricDimension {
    id: string;
    name: string;
    criteria: RubricCriterion[];
}

export interface Evaluation {
    id: string;
    projectId: string;
    evaluatorId: string;
    status: 'draft' | 'pending_sync' | 'synced';
    dimensions: RubricDimension[];
    finalScore: number;
    createdAt: string;
    syncedAt?: string;
}

// Navigation types
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    // Evaluador screens
    DashboardEvaluador: undefined;
    Evaluacion: { projectId: string };
    RevisionArchivos: { projectId: string; evidenceIndex: number };
    ResumenEvaluacion: { evaluationId: string };
    // Evaluado screens
    DashboardEvaluado: undefined;
    CargaDocumentos: { projectId: string };
    ConfirmacionCarga: { filesCount: number; totalSize: string };
    // Admin screens
    DashboardAdmin: undefined;
};
