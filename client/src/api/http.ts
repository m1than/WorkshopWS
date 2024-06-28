import axios from 'axios';

class HttpClient {
    private api = axios.create({
        baseURL: 'http://localhost:8000/api',
    });

    async getMessages() {
        const response = await this.api.get('/messages');
        return response.data;
    }

    async getUsers() {
        const response = await this.api.get('/users');
        return response.data;
    }
}

export default HttpClient;