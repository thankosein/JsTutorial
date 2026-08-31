export class DocumentType {
    constructor(data = {}) {
        this.documentTypeID = data.documentTypeID || 0;
        this.documentTypeDesc = data.documentTypeDesc || '';
        this.isActive = Boolean(data.isActive);
        this.remark = data.remark || '-';
    }
}

export class PagedResult {
    constructor(data = {}, ItemModel) {
        this.items = Array.isArray(data.items) ? data.items.map(item => new ItemModel(item)) : [];
        this.pageNumber = Number(data.pageNumber) || 1;
        this.totalPages = Number(data.totalPages) || 1;
        this.totalCount = Number(data.totalCount) || 0;
        this.hasPreviousPage = Boolean(data.hasPreviousPage);
        this.hasNextPage = Boolean(data.hasNextPage);
    }
}