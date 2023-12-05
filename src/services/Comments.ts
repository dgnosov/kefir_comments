import axios from "axios";

interface IComment {
    author: number;
    created: string;
    id: number;
    likes: number;
    parent: number | null;
    text: string;
}

export interface IComments {
    data: IComment[];
    status: number;
}

export async function getComments(param: number): Promise<IComments> {
    return axios
        .get(`api/comments`, {params: {page: param}})
        .then((response) => {
            return {
                data: response.data,
                status: response.status,
            };
        })
        .catch((err) => {
            console.error("There is an error: ==> getComments:", err.response);
            return err.response;
        });
}
