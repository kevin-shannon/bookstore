--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0
-- Dumped by pg_dump version 13.0

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    admin_id integer NOT NULL,
    username character varying(30) NOT NULL,
    name character varying(100),
    password character(64) NOT NULL
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: author; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.author (
    author_id integer NOT NULL,
    name character varying(100),
    url character varying(150),
    address character varying(100)
);


ALTER TABLE public.author OWNER TO postgres;

--
-- Name: book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book (
    book_id integer NOT NULL,
    condition character varying(20),
    price money,
    customer_id integer,
    admin_id integer,
    vendor_id integer,
    isbn character(13)
);


ALTER TABLE public.book OWNER TO postgres;

--
-- Name: categorized_by; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorized_by (
    isbn character(13) NOT NULL,
    type character varying(30) NOT NULL
);


ALTER TABLE public.categorized_by OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    customer_id integer NOT NULL,
    email character varying(50) NOT NULL,
    address character varying(150),
    phone_number character varying(30),
    username character varying(30) NOT NULL,
    name character varying(100),
    password character(64) NOT NULL
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre (
    type character varying(30) NOT NULL
);


ALTER TABLE public.genre OWNER TO postgres;

--
-- Name: title; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.title (
    isbn character(13) NOT NULL,
    name character varying(100) NOT NULL,
    published_date character varying(30),
    rating integer
);


ALTER TABLE public.title OWNER TO postgres;

--
-- Name: vendor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor (
    vendor_id integer NOT NULL,
    name character varying(30),
    url character varying(150),
    address character varying(100)
);


ALTER TABLE public.vendor OWNER TO postgres;

--
-- Name: written_by; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.written_by (
    isbn character(13) NOT NULL,
    author_id integer NOT NULL
);


ALTER TABLE public.written_by OWNER TO postgres;

--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (admin_id, username, name, password) FROM stdin;
1	admin1	Mark	85f5e10431f69bc2a14046a13aabaefc660103b6de7a84f75c4b96181d03f0b5
2	admin2	\N	B63B99F6383BA713B57DDFC77737C5F71639FA6F4663EFE60A66A8C6D114B545
3	admin3	\N	FCEC91509759AD995C2CD14BCB26B2720993FAF61C29D379B270D442D92290EB
5	admin5	\N	D254625EF1EBED68EE288B1A9F02D5C84C2D258447C2D1197FDF0BE81B662861
6	admin6	Frank	B955E6CD0808744CF5CBA260906E156AB4C43076B4C933DEA0A1DF1BAAE2A4BB
8	admin8	\N	C1F026582FE6E8CB620D0C85A72FE421DDDED756662A8EC00ED4C297AD10676B
9	admin9	\N	C08065E40EA37BCECE745A2339AC61935A671B39D8D8564453CFF6C22441034C
10	admin10	\N	17F6B5F06BE370BEF7FFF073EDBE107B8D684E49B58F4440454E9045315DACAC
11	admin11	Joe	F9C5FB76430088CF33EFBCE019DC57B2E9CF52D9084CEDB5CBBD62B7A10E4345
12	admin12	\N	4DA860A59A46E88C2B71A71BAF7A2E2D0B2B42C583FFB04E8F0F671DFD0B3493
\.


--
-- Data for Name: author; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.author (author_id, name, url, address) FROM stdin;
628290	Sabrina Morales	http://sabrina.com	4099 Fulton Street
153503	Michael S Holmes	http://mholmes.com	3694 Beechwood Drive
853058	Anya Mosley	http://anyamos.com	2658 Evergreen Lane
123456	Jacob Patterson	http://jpat.com	4560 E. Doraango Ave.
133113	James Harden	http://jamesharden	7810 Firewood Lane
890987	Alex Jameson	http://alexjam	291 Kyrene Blvd
91823	Devin Ayton	http://allthebest	781 Minstra Drive
901293	Tyler Robinson	http://ageisanumber	1243 Agenine Ave
236623	James Davis	http://gameon	1092 Gametree Ave
113453	Nikola Murray	http://gonuggets	1761 Boulder Drive
\.


--
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book (book_id, condition, price, customer_id, admin_id, vendor_id, isbn) FROM stdin;
309733	new	$29.99	941643	1	642288	8-3743-2349-X
611199	new	$34.99	345182	5	132421	0-2342-2784-X
231312	like new	$31.99	\N	8	132421	1-8394-5432-0
537892	used	$9.99	\N	2	95880	0-2384-7874-2
102932	used	$24.99	\N	5	676273	0-4758-2342-X
589012	like new	$26.99	815008	3	156455	0-7819-3958-5
901212	good	$21.99	\N	5	156455	0-1232-4232-6
97864	good	$21.99	815008	6	676273	0-2298-0313-X
50370	good	$19.99	\N	1	761655	0-3421-7843-X
23143	used	$12.99	\N	11	676273	0-6534-3972-5
\.


--
-- Data for Name: categorized_by; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorized_by (isbn, type) FROM stdin;
0-7819-3958-5	Nonfiction
0-2298-0313-X	Nonfiction
0-6534-3972-5	SciFi
0-3421-7843-X	SciFi
8-3743-2349-X	Mystery
0-2384-7874-2	Romance
0-1232-4232-6	Adventure
0-2342-2784-X	Fiction
1-8394-5432-0	Adventure
0-4758-2342-X	Romance
0-3421-7843-X	Adventure
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (customer_id, email, address, phone_number, username, name, password) FROM stdin;
815008	samaga@burgas.vip	1049  Godfrey Street	503-588-2907	customer1	Sam	74796DFECB955D13AA17CFF83EB3B874D129C4AC5083F544DB3C0EC03B573199
941643	retipa36@septicvernon.com	14702  Romano Street	781-363-1481	customer2	\N	BA4788B226AA8DC2E6DC74248BB9F618CFA8C959E0C26C147BE48F6839A0B088
282819	hfuea78@rowmin.com	2811 Stone Lane	781-363-1481	customer3	\N	8E0A1B0ADA42172886FD1297E25ABF99F14396A9400ACBD5F20DA20289CFF02F
902876	goron56@rowmin.com	9012 Mable Lane	480-865-5762	customer4	Goron	C006C7E3AB14D686F63524136F1EC7C5E553D839BC01C851E4DC9DE2BDBFC589
985632	haley@cox.com	786 Geniene Street	480-907-6543	customer5	Haley	C685A2C9BAB235CCDD2AB0EA92281A521C8AAF37895493D080070EA00FC7F5D7
345182	harish@cox.com	786 Chandler Blvd	480-267-3272	customer6	\N	A67A41C8BC79D5DA917B5051F1F0D3F5AEB4B63BA246B3546A961EF7A3C7D931
378273	jappleseed@yahoo.com	102 E. Warner Blvd.	602-453-1322	customer7	John	16477688C0E00699C6CFA4497A3612D7E83C532062B64B250FED8908128ED548
274271	jblessedalive@yahoo.com	420 W. Jefferson Road	602-312-4321	customer8	\N	B1F51A511F1DA0CD348B8F8598DB32E61CB963E5FC69E2B41485BF99590ED75A
442412	johngaben@yahoo.com	4132 W. Priest Road	480-463-5432	customer9	John	018FA96A44715C90BF93BE148069CB28DD45D398F2CC75AA1565311F6E55D174
190232	henryren@yahoo.com	5425 N. Ash Ave.	480-532-2412	customer10	Henry	5EB67F9F8409B9C3F739735633CBDF92121393D0E13BD0F464B1B2A6A15AD2DC
\.


--
-- Data for Name: genre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genre (type) FROM stdin;
Nonfiction
SciFi
Mystery
Romance
Adventure
Fiction
\.


--
-- Data for Name: title; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.title (isbn, name, published_date, rating) FROM stdin;
0-7819-3958-5	The Summer	01/22/90	80
0-2298-0313-X	Into The Blue	04/25/19	92
0-6534-3972-5	Dynasty	11/17/10	74
8-3743-2349-X	Last Dance	03/23/98	91
0-3421-7843-X	Maybe I Will	04/24/18	72
0-2384-7874-2	Bites the Dust	2/24/19	87
0-1232-4232-6	A Nation Divided	11/11/12	88
1-8394-5432-0	Promise Land	1/28/20	61
0-2342-2784-X	A New Year	12/30/08	94
0-4758-2342-X	The Three Wishes	11/01/10	77
\.


--
-- Data for Name: vendor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor (vendor_id, name, url, address) FROM stdin;
95880	Books Supply	http://caetlujj.com	4603 Orchard Street
642288	Booktopia	http://eccaqssiik.com	4591 High Meadow Lane
761655	Greensleaf Books	http://facqssiikk.com	2591 Black Oak Hollow Road
156455	Changing Hands	http://changehands.com	231 E. Guadelupe Blvd
132421	Best Books	http://bestbook.com	662 Black Hawk Road
676273	SunDevil Bookstore	http://devilbook.com	942 SunDevil Ave
\.


--
-- Data for Name: written_by; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.written_by (isbn, author_id) FROM stdin;
0-7819-3958-5	628290
0-2298-0313-X	153503
0-6534-3972-5	853058
1-8394-5432-0	113453
0-2342-2784-X	91823
0-2298-0313-X	236623
0-1232-4232-6	901293
8-3743-2349-X	123456
1-8394-5432-0	890987
\.


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (admin_id);


--
-- Name: author author_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (author_id);


--
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (book_id);


--
-- Name: categorized_by categorized_by_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorized_by
    ADD CONSTRAINT categorized_by_pkey PRIMARY KEY (isbn, type);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (customer_id);


--
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (type);


--
-- Name: title title_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.title
    ADD CONSTRAINT title_pkey PRIMARY KEY (isbn);


--
-- Name: vendor vendor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (vendor_id);


--
-- Name: written_by written_by_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.written_by
    ADD CONSTRAINT written_by_pkey PRIMARY KEY (isbn, author_id);


--
-- Name: book book_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin(admin_id) ON DELETE SET NULL;


--
-- Name: book book_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE SET NULL;


--
-- Name: book book_isbn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.title(isbn) ON DELETE CASCADE;


--
-- Name: book book_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendor(vendor_id) ON DELETE CASCADE;


--
-- Name: categorized_by categorized_by_isbn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorized_by
    ADD CONSTRAINT categorized_by_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.title(isbn) ON DELETE CASCADE;


--
-- Name: categorized_by categorized_by_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorized_by
    ADD CONSTRAINT categorized_by_type_fkey FOREIGN KEY (type) REFERENCES public.genre(type) ON DELETE SET NULL;


--
-- Name: written_by written_by_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.written_by
    ADD CONSTRAINT written_by_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(author_id) ON DELETE SET NULL;


--
-- Name: written_by written_by_isbn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.written_by
    ADD CONSTRAINT written_by_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.title(isbn) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

