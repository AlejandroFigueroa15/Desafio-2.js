const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
            }
        } catch (err) {
            return []
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error('Error al guardar productos:', err);
        }
    }

    generateId() {
        return this.products.length > 0
            ? Math.max(...this.products.map((product) => product.id)) + 1
            : 1;
    }

    addProduct(product) {
        if (!product.title || product.title == "" || !product.description || product.description == "" || !product.price || product.price == 0 || !product.thumbnail || product.thumbnail == "" || !product.code || product.code == "" || !product.stock) {
            console.error('Es necesario completar todos los campos');
            return;
        }

        const existingProduct = this.products.find((p) => p.code === product.code);
        if (existingProduct) {
            console.error('Ya existe un producto con el mismo ID');
            return;
        }

        const newProduct = {
            id: this.generateId(),
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
        };

        this.products.push(newProduct);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.error('No se encontró');
            return;
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.error('No se encontró');
            return;
        } else {
            console.log("Producto a actualizar encontrado");
        }

        const updatedProduct = { ...this.products[productIndex], ...updatedFields };
        this.products[productIndex] = updatedProduct;
        this.saveProducts();
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.error('No se encontró');
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveProducts();
    }
}

module.exports = ProductManager;