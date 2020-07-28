import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list-grid.component.html',
    // templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
    products: Product[];
    currentCategoryId: number = 1;
    // tslint:disable-next-line:no-inferrable-types
    searchMode: boolean = true;
    // tslint:disable-next-line:no-inferrable-types
    previousCategoryId: number = 1;

    previousKeyWord: string = null;

    thePageNumber: number = 1;
    thePageSize: number = 5;
    theTotalElements: number = 0;

    // inject ProductService object
    constructor(
        private productService: ProductService,
        private cartService:CartService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => {
            this.listProducts();
        });
    }

    listProducts() {
        // check if search route contain keyword value
        this.searchMode = this.route.snapshot.paramMap.has('keyword');

        if (this.searchMode) {
            this.handleSearchProducts();
        } else {
            this.handleListProducts();
        }
    }
    handleSearchProducts() {
        const keyWordValue: string = this.route.snapshot.paramMap.get(
            'keyword'
        );

        if (this.previousKeyWord !== keyWordValue) {
            this.thePageNumber = 1;
        }

        this.previousKeyWord = keyWordValue;

        // search for products using keyword
        this.productService
            .searchProductsListPaginate(
                this.thePageNumber - 1,
                this.thePageSize,
                keyWordValue
            )
            .subscribe(this.processResult());
    }

    handleListProducts() {
        //  check if 'id' parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
        if (hasCategoryId) {
            //  convert string to number by '+' symbol
            this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
        } else {
            //  not category available. default to 1
            this.currentCategoryId = 1;
        }

        if (this.previousCategoryId !== this.currentCategoryId) {
            this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        console.log(
            `currentCategoryId= ${this.currentCategoryId}, thePageNumber= ${this.thePageNumber}`
        );

        //  get product for given category id
        this.productService
            .getProductsListPaginate(
                this.thePageNumber - 1,
                this.thePageSize,
                this.currentCategoryId
            )
            .subscribe(this.processResult());
    }
    processResult() {
        return (data) => {
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
        };
    }
    updatePageSize(pageSize: number) {
        this.thePageSize = pageSize;
        this.thePageNumber = 1;
        this.listProducts();
    }

    addToCart(theProduct: Product) {
        console.log(
            `Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`
        );
        const cartItem = new CartItem(theProduct);

        this.cartService.addToCart(cartItem);
    }
}
