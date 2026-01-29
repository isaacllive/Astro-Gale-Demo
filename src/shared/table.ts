/**
 * Table configuration types and utilities
 */

export interface TableQuery {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
}

export interface TableResponse<T> {
    data: T[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface ColumnDef {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    /**
     * Render function that can return either plain text or HTML string.
     * HTML strings will be automatically detected and rendered as HTML.
     */
    render?: (value: any, row: any) => string;
    className?: string;
    width?: string;
}

export interface TableAction {
    label: string;
    action: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onClick?: string;
}

/**
 * Parse table query parameters from URL
 */
export function parseTableQuery(url: URL): TableQuery {
    return {
        page: parseInt(url.searchParams.get('page') || '1', 10),
        pageSize: parseInt(url.searchParams.get('pageSize') || '10', 10),
        sortBy: url.searchParams.get('sortBy') || undefined,
        sortOrder: (url.searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc',
        search: url.searchParams.get('search') || undefined,
    };
}

/**
 * Build table response
 */
export function buildTableResponse<T>(
    data: T[],
    totalCount: number,
    query: TableQuery
): TableResponse<T> {
    return {
        data,
        totalCount,
        currentPage: query.page || 1,
        pageSize: query.pageSize || 10,
        totalPages: Math.ceil(totalCount / (query.pageSize || 10)),
    };
}
