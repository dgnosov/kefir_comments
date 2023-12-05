import axios from "axios";

interface IAuthor {
    avatar: string;
    id: number;
    name: string;
}

export interface IAuthors {
    data: IAuthor[];
    status: number;
}

export async function getAuthors(): Promise<IAuthors> {
    return axios
        .get(`api/authors`, {})
        .then((response) => {
            return {
                data: response.data,
                status: response.status,
            };
        })
        .catch((err) => {
            console.error("There is an error: ==> getAuthors:", err.response);
            return err.response;
        });
}
