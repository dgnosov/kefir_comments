import axios from "axios";

export interface IComment {
    replies: never[];
    id: number;
    author: number;
    created: string;
    likes: number;
    parent: number | null;
    text: string;
}

export interface IComments {
    data: IComment[];
    pagination: {
        page: number;
        size: number;
        total_pages: number;
    };
    status: number;
}

export async function getComments(param: number): Promise<IComments> {
    return axios
        .get(`api/comments`, {params: {page: param}})
        .then((response) => {
            return {
                data: response.data.data,
                pagination: response.data.pagination,
                status: response.status,
            };
        })
        .catch((err) => {
            console.error("There is an error: ==> getComments:", err.response);
            return err.response;
        });
}
