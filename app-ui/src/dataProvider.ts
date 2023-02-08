import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
// import axios from 'axios';

const apiUrl = 'http://localhost:8000/api';
// const httpClient = fetchUtils.fetchJson;

const not_protected_routes = [
    'login',
    'register'
]

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    if(localStorage.getItem('access') && not_protected_routes.find((r) => url.includes(r)) === undefined) {
        options.headers.set('Authorization', `Bearer ${localStorage.getItem('access')}`)
    }

    return fetchUtils.fetchJson(url, options);
}

export const dataProvider= { 
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            let data = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
            Object.keys(data).map(function(key: any) {
                if (!Array.isArray(data[key]) /*typeof data[key] == "object"*/) {
                    if (data[key].id === undefined) {
                        data[key].id = 0;
                    }
                }

                // if (typeof data[key] == 'string' && typeof key == 'string') {
                //     var obj: any = { id: 0, key: key, value: data[key] };
                //     newArray.push(obj);
                // }
            });

            return ({
                data: data,
                total: headers.get('content-range') !== null ? parseInt(headers.get('content-range').split('/').pop(), 10) : Array.isArray(json) ? json.length : (Array.isArray(json.data) ? json.data.length : 0),
            })
        })
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            // data: params.data,
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            // data: params.data,
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
            // data: params.data,
        }).then(({ json }) => ({
            data: { ...params.data, ...json, id: json.id !== undefined ? json.id : 0 },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }));
    }
};
