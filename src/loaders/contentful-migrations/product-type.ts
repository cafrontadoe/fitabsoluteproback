import Migration, { 
    MigrationContext,
  } from "contentful-migration"
  
  export function productTypeMigration(
    migration: Migration,
    context?: MigrationContext
  ) {
    const collection = migration
      .createContentType("productType")
      .name("Product Type")
      .displayField("title")
  
      collection
        .createField("title")
        .name("Title")
        .type("Symbol")
        .required(true)
      collection
        .createField("medusaId")
        .name("Medusa ID")
        .type("Symbol")
  }
  