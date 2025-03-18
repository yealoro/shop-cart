import "reflect-metadata"
import { DataSource } from "typeorm"
import { Product } from "./products/product.entity"
import { Category } from "./categories/category.entity"
import { Variant } from "./variants/variant.entity"
import { Image } from "./images/image.entity"
import { Review } from "./reviews/review.entity"
import { SEO } from "./seo/seo.entity"
import * as dotenv from "dotenv"

// Load environment variables from .env file


