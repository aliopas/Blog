CREATE TABLE "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_name" varchar(50) NOT NULL,
	"key_value" text NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"quota_exceeded" boolean DEFAULT false NOT NULL,
	"last_used_at" timestamp,
	"reset_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_name_unique" UNIQUE("key_name")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "post_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"total_views" integer DEFAULT 0 NOT NULL,
	"unique_visitors" integer DEFAULT 0 NOT NULL,
	"avg_time_on_page" integer DEFAULT 0,
	"last_viewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_metrics_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"image_url" text,
	"image_hint" text,
	"category_id" integer NOT NULL,
	"published_at" varchar(50) NOT NULL,
	"read_time" integer DEFAULT 5 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"topic" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "quality_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"readability_score" integer NOT NULL,
	"keyword_density_score" integer NOT NULL,
	"is_high_quality" boolean NOT NULL,
	"suggestions" text,
	"checked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visitors" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"country" varchar(100),
	"city" varchar(100),
	"latitude" real,
	"longitude" real,
	"user_agent" text,
	"page_visited" text NOT NULL,
	"post_id" integer,
	"visited_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_metrics" ADD CONSTRAINT "post_metrics_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quality_checks" ADD CONSTRAINT "quality_checks_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;