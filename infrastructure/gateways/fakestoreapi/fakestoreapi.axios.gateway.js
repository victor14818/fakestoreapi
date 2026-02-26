const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const ProductGateway = require('../../../domain/gateways/product.gateway.interface');

class FakeStoreApiGateway extends ProductGateway {

    constructor() {

        super();

        this.client = axios.create({
            baseURL: 'https://fakestoreapi.com',
            timeout: 3000
        });

        axiosRetry(this.client, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,

            retryCondition: (error) => {

                if (error.code === 'ECONNABORTED') return true;

                if (!error.response) return true;

                return error.response.status >= 500;
            }
        });
    }

    async fetchProducts() {

        try {

            const response =
                await this.client.get('/products');

            return response.data;

        } catch (error) {

            throw new Error(
                'FakeStoreAPI unavailable after retries'
            );
        }
    }
}

module.exports = FakeStoreApiGateway;
