const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = "https://fitabsoluteprofront-cafrontadoe.vercel.app/,https://fitabsoluteprofront-cafrontadoe.vercel.app" || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://default:Lnb6LIMDHJn23ggl5lejKjPaiiFg61pL@roundhouse.proxy.rlwy.net:42575";

const STRIPE_API_KEY = process.env.STRIPE_API_KEY || ""

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: false,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  {
    resolve: `medusa-file-s3`,
    options: {
        s3_url: process.env.S3_URL,
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION,
        access_key_id: process.env.S3_ACCESS_KEY_ID,
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
        cache_control: process.env.S3_CACHE_CONTROL
    },
  },
  {
    resolve: `medusa-plugin-contentful`,
    options: {
      space_id: process.env.CONTENTFUL_SPACE_ID,
      access_token: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENV,
      custom_product_fields: {
        title: "name",
        subtitle: "subtitle",
        description: "description",
        variants: "variants",
        options: "options",
        medusaId: "medusaId",
        type: "type",
        collection: "collection",
        tags: "tags",
        handle: "handle",
      },
      custom_variant_fields: {
        title: "name",
        sku: "sku",
        prices: "prices",
        options: "options",
        medusaId: "medusaId"
      },
      custom_region_fields: {
        name: "name",
        countries: "countries",
        paymentProviders: "paymentProviders",
        fulfillmentProviders: "fulfillmentProviders",
        medusaId: "medusaId"
      },
      custom_collection_fields: {
        title: "title",
        medusaId: "medusaId"
      },
      custom_type_fields: {
        name: "name",
        medusaId: "medusaId"
      },
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
   redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
