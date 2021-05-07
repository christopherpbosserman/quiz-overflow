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

INSERT INTO public.questions (_id, text) VALUES (1, 'How do you create a function in JavaScript?');
INSERT INTO public.questions (_id, text) VALUES (2, 'Inside which HTML element do we put the JavaScript?');
INSERT INTO public.questions (_id, text) VALUES (3, 'How do you write "Hello World" in an alert box?');
INSERT INTO public.questions (_id, text) VALUES (4, 'How to write an IF statement in JavaScript?');
INSERT INTO public.questions (_id, text) VALUES (5, 'How do you find the number with the highest value of x and y?');
INSERT INTO public.questions (_id, text) VALUES (6, 'What will the following code return: Boolean(10 > 9)');
INSERT INTO public.questions (_id, text) VALUES (7, 'In Javascript, what type of value is returned from calling Date() as a function? (ex. const d = Date())');
INSERT INTO public.questions (_id, text) VALUES (8, 'Inside of a loop, variables declared with which Javascript keyword can be redeclared?');

 INSERT INTO public.choices (question_id, text, is_correct) VALUES (1, 'function myFunction()', true);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (1, 'function:myFunction()', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (1, 'function = myFunction()', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (1, 'function myFunction', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (2, '<script>', true);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (2, '<javascript>', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (2, '<js>', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (2, '<scripting>', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (3, 'alertBox("Hello World");', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (3, 'alert("Hello World");', true);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (3, 'msgBox("Hello World");', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (3, 'msg("Hello World");', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (4, 'if (i == 5)', true);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (4, 'if i = 5 then', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (4, 'if i = 5', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (4, 'if i == 5 then', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (5, 'Math.max(x, y)', true);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (5, 'ceil(x, y)', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (5, 'Math.ceil(x, y)', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (5, 'top(x, y)', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (6, 'true', true);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (6, 'false', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (6, 'NaN', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (6, '1', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (7, 'string', true);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (7, 'null', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (7, 'number', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (7, 'object', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (8, 'var', true);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (8, 'int', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (8, 'const', false);
 INSERT INTO public.choices (question_id, text, is_correct) VALUES (8, 'let', false);