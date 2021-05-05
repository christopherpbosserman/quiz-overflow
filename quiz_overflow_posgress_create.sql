SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE TABLE public.users (
	"_id" serial NOT NULL,
	"username" varchar(32) NOT NULL,
	"password" varchar(32) NOT NULL,
	"high_score" integer NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.questions (
	"_id" serial NOT NULL,
	"text" varchar NOT NULL,
	CONSTRAINT "questions_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.choices (
	"_id" serial NOT NULL,
	"question_id" integer NOT NULL,
	"text" varchar NOT NULL,
  "is_correct" boolean NOT NULL,
	CONSTRAINT "choices_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE public.choices ADD CONSTRAINT "choices_fk0" FOREIGN KEY ("question_id") REFERENCES public.questions("_id");
