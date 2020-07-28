import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private baseUrl = 'http://localhost:8080/api/products';
    private categoryUrl = 'http://localhost:8080/api/product-category';
    constructor(private httpClient: HttpClient) {}

    /**
     * Search product for category id
     * @param theCategoryId
     */
    getProductsListPaginate(
        thePage: number,
        thePageSize: number,
        theCategoryId: number
    ): Observable<GetResponeProducts> {
        //need build URL base on category id
        const searchUrl =
            `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
            `&page=${thePage}` +
            `&size=${thePageSize}`;

        return this.httpClient.get<GetResponeProducts>(searchUrl);
    }

    /**
     * Search product for category id
     * @param theCategoryId
     */
    getProductsList(theCategoryId: number): Observable<Product[]> {
        // need build URL base on category id
        const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

        return this.getProducts(searchUrl);
    }

    /**
     * Get all product category
     */
    getProductCategories(): Observable<ProductCategory[]> {
        return this.httpClient
            .get<GetResponeProductCategories>(this.categoryUrl)
            .pipe(map((respone) => respone._embedded.productCategory));
    }

    /**
     * Search for product by keyword service
     * @param keyWordValue
     */
    searchProducts(keyWordValue: string): Observable<Product[]> {
        const searchKeyWordUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWordValue}`;
        return this.getProducts(searchKeyWordUrl);
    }

    /**
     * Search product for key word pagination
     * @param theCategoryId
     */
    searchProductsListPaginate(
        thePage: number,
        thePageSize: number,
        theKeyWord: string
    ): Observable<GetResponeProducts> {
        // need build URL base on category id
        const searchUrl =
            `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}` +
            `&page=${thePage}` +
            `&size=${thePageSize}`;

        return this.httpClient.get<GetResponeProducts>(searchUrl);
    }

    /**
     * Get product detail
     * @param theProductId
     */
    getProduct(theProductId: number): Observable<Product> {
        const productUrl = `${this.baseUrl}/${theProductId}`;
        return this.httpClient.get<Product>(productUrl);
    }

    /**
     * common methoed for get products
     * @param searchUrl
     */
    private getProducts(searchUrl: string): Observable<Product[]> {
        return this.httpClient
            .get<GetResponeProducts>(searchUrl)
            .pipe(map((respone) => respone._embedded.products));
    }
}
interface GetResponeProducts {
    _embedded: {
        products: Product[];
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

interface GetResponeProductCategories {
    _embedded: {
        productCategory: ProductCategory[];
    };
}
