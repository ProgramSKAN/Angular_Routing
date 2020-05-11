
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { MessageService } from "../../messages/message.service";

import { Product, ProductResolved } from "../product";
import { ProductService } from "../product.service";

@Component({
  templateUrl: "./product-edit.component.html",
  styleUrls: ["./product-edit.component.css"],
})
export class ProductEditComponent implements OnInit {
  pageTitle = "Product Edit";
  errorMessage: string;

  //product: Product;
  private dataIsValid: { [key: string]: boolean } = {}

  private currentProduct: Product;
  private originalProduct: Product;

  get product(): Product {
    return this.currentProduct;
  }

  set product(value: Product) {
    this.currentProduct = value;
    //clone the object to retain the copy(using spread operater)
    this.originalProduct = { ...value };
  }

  get isDirty(): boolean {
    //order of the form values matter to make this work
    return JSON.stringify(this.originalProduct) != JSON.stringify(this.currentProduct);
  }

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const resolvedData: ProductResolved = this.route.snapshot.data['resolvedData'];
      this.errorMessage = resolvedData.error;
      this.onProductRetrieved(resolvedData.product);
    })

    // this.route.paramMap.subscribe((params) => {
    //   const id = +params.get("id");
    //   this.getProduct(id);
    // });
  }

  // getProduct(id: number): void {
  //   this.productService.getProduct(id).subscribe({
  //     next: (product) => this.onProductRetrieved(product),
  //     error: (err) => (this.errorMessage = err),
  //   });
  // }

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = "No product found";
    } else {
      if (this.product.id === 0) {
        this.pageTitle = "Add Product";
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () =>
            this.onSaveComplete(`${this.product.productName} was deleted`),
          error: (err) => (this.errorMessage = err),
        });
      }
    }
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {//check if specific tab is valid if path provided
      return this.dataIsValid[path];
    }//else check wheather every tab is valid
    return (this.dataIsValid && Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true));
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () =>
            this.onSaveComplete(
              `The new ${this.product.productName} was saved`
            ),
          error: (err) => (this.errorMessage = err),
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () =>
            this.onSaveComplete(
              `The updated ${this.product.productName} was saved`
            ),
          error: (err) => (this.errorMessage = err),
        });
      }
    } else {
      this.errorMessage = "Please correct the validation errors.";
    }
  }

  reset(): void {//clear validation stucture, so that confirm dialog wont appear on save button
    this.dataIsValid = null;
    this.currentProduct = null;
    this.originalProduct = null;
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.reset();
    // Navigate back to the product list
    this.router.navigate(["/products"]);
  }

  validate(): void {
    //clear the validation object
    this.dataIsValid = {}

    //'info' tab
    if (this.product.productName && this.product.productName.length >= 3 && this.product.productCode) {
      this.dataIsValid['info'] = true;
    } else {
      this.dataIsValid['info'] = false;
    }

    //'tags' tab
    if (this.product.category && this.product.category.length >= 3) {
      this.dataIsValid['tags'] = true;
    } else {
      this.dataIsValid['tags'] = false;
    }
  }
}
