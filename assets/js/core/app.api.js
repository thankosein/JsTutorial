export const AppAPI = {
    // Relative Path ပြောင်းပေးရပါမည် (Domain/Port မပါရပါ)
    baseUrl: '', 

    async request(endpoint, method = 'GET', body = null) {
        const config = { 
            method, 
            headers: { 'Content-Type': 'application/json' } 
        };
        if (body) config.body = JSON.stringify(body);

        // baseUrl အလွတ်ဖြစ်သွားသည့်အတွက် Fetch ရဲ့ URL က /api/v2/... ဟု ဖြစ်သွားပြီး Live Server Proxy ထံ တိုက်ရိုက်ရောက်ပါမည်
        const res = await fetch(`${this.baseUrl}${endpoint}`, config);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return await res.json();
    },

    get(url) { return this.request(url, 'GET'); },
    post(url, data) { return this.request(url, 'POST', data); },
    delete(url) { return this.request(url, 'DELETE'); }
};