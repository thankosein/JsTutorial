// import { AppAPI } from '../core/app.api.js';
// import { DocumentType, PagedResult } from '../models/document-type.model.js';

// export class DocumentTypeService {
//     static async getReport(pageNumber = 1, pageSize = 10) {
//         const rawData = await AppAPI.get(`/api/v2/vts/documenttype/report?PageNumber=${pageNumber}&PageSize=${pageSize}`);
//         return new PagedResult(rawData, DocumentType);
//     }

//     static async deleteDocumentType(id) {
//         return await AppAPI.delete(`/api/v2/vts/documenttype/${id}`);
//     }
// }
// document-type.service.js က assets/js/services/ ထဲမှာ ရှိပါက:
import { createApiServiceV2 } from '../core/api.service.js';

// 💡 အကယ်၍ api.service.js က services/ ထဲမှာပဲ core/ မပါဘဲ တိုက်ရိုက်ရှိနေရင်:
// import { createApiServiceV2 } from './api.service.js';

const api = createApiServiceV2('vts/documenttype');

export const DocumentTypeService = {
    getReport: api.getReport,
    getAll: api.getAll,
    getById: api.getById,
    deleteDocumentType: api.remove,
    createDocumentType: api.create,
    updateDocumentType: api.update
};