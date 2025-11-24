import axios from 'axios';

export const api = axios.create({
    //10.0.1.33:6969
    baseURL: 'http://localhost:6969',
    headers: {
        'Content-Type': 'application/json',
    },
});

//GetAllVotes - Összes szavazat lekérése
export const getAllVotes = async () => {
    const response = await api.get('/votes');
    return response.data;
};

//GetVoteById
export const getVoteById = async (id: string) => {
    const response = await api.get(`/votes/${id}`);
    return response.data;
};