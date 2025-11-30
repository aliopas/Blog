CREATE TABLE "blog_api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_name" varchar(50) NOT NULL,
	"key_value" text NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"quota_exceeded" boolean DEFAULT false NOT NULL,
	"last_used_at" timestamp,
	"reset_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_api_keys_key_name_unique" UNIQUE("key_name")
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_post_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"total_views" integer DEFAULT 0 NOT NULL,
	"unique_visitors" integer DEFAULT 0 NOT NULL,
	"avg_time_on_page" integer DEFAULT 0,
	"last_viewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_post_metrics_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
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
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_quality_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"readability_score" integer NOT NULL,
	"keyword_density_score" integer NOT NULL,
	"is_high_quality" boolean NOT NULL,
	"suggestions" text,
	"checked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_visitors" (
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
DROP TABLE "api_keys" CASCADE;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
DROP TABLE "post_metrics" CASCADE;--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
DROP TABLE "quality_checks" CASCADE;--> statement-breakpoint
DROP TABLE "visitors" CASCADE;--> statement-breakpoint
ALTER TABLE "blog_post_metrics" ADD CONSTRAINT "blog_post_metrics_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_quality_checks" ADD CONSTRAINT "blog_quality_checks_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_visitors" ADD CONSTRAINT "blog_visitors_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;