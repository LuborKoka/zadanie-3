const db = require('./database')


async function build() {
    try {

        const r = await db.query(`

        DROP TABLE IF EXISTS public.add;
        DROP TABLE IF EXISTS public.hips;
        DROP TABLE IF EXISTS public.weight;
        DROP TABLE IF EXISTS public.methods;
        DROP TABLE IF EXISTS public.users;
        DROP TABLE IF EXISTS public.waist;

        CREATE TABLE  public.add (
            id integer NOT NULL,
            image text,
            link text,
            count integer,
            text character varying(150)
        );
        
        
        ALTER TABLE public.add OWNER TO postgres;
        
        --
        -- TOC entry 220 (class 1259 OID 26053)
        -- Name: hips; Type: TABLE; Schema: public; Owner: postgres
        --
        
        CREATE TABLE public.hips (
            id integer NOT NULL,
            userid integer NOT NULL,
            value double precision,
            date date,
            method_id integer
        );
        
        
        ALTER TABLE public.hips OWNER TO postgres;
        
        --
        -- TOC entry 210 (class 1259 OID 25993)
        -- Name: hips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
        --
        
        CREATE SEQUENCE IF NOT EXISTS public.hips_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
        
        
        ALTER TABLE public.hips_id_seq OWNER TO postgres;
        
        --
        -- TOC entry 219 (class 1259 OID 26052)
        -- Name: hips_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
        --
        
        CREATE SEQUENCE IF NOT EXISTS public.hips_id_seq1
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
        
        
        ALTER TABLE public.hips_id_seq1 OWNER TO postgres;
        
        --
        -- TOC entry 3365 (class 0 OID 0)
        -- Dependencies: 219
        -- Name: hips_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
        --
        
        ALTER SEQUENCE public.hips_id_seq1 OWNED BY public.hips.id;
        
        
        --
        -- TOC entry 211 (class 1259 OID 25997)
        -- Name: methods; Type: TABLE; Schema: public; Owner: postgres
        --
        
        CREATE TABLE public.methods (
            name character varying(50),
            description text,
            user_id integer NOT NULL,
            id integer NOT NULL
        );
        
        
        ALTER TABLE public.methods OWNER TO postgres;
        
        --
        -- TOC entry 213 (class 1259 OID 26005)
        -- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
        --
        
        CREATE SEQUENCE IF NOT EXISTS public.users_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
        
        
        ALTER TABLE public.users_id_seq OWNER TO postgres;
        
        --
        -- TOC entry 212 (class 1259 OID 26002)
        -- Name: users; Type: TABLE; Schema: public; Owner: postgres
        --
        
        CREATE TABLE public.users (
            id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
            name character varying(50) NOT NULL,
            password character varying(100) NOT NULL,
            email character varying(250),
            age integer,
            height integer,
            weight integer
        );
        
        
        ALTER TABLE public.users OWNER TO postgres;
        
        --
        -- TOC entry 218 (class 1259 OID 26038)
        -- Name: waist; Type: TABLE; Schema: public; Owner: postgres
        --
        
        CREATE TABLE public.waist (
            id integer NOT NULL,
            userid integer NOT NULL,
            value double precision,
            date date,
            method_id integer
        );
        
        
        ALTER TABLE public.waist OWNER TO postgres;
        
        --
        -- TOC entry 214 (class 1259 OID 26009)
        -- Name: waist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
        --
        
        CREATE SEQUENCE IF NOT EXISTS public.waist_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
        
        
        ALTER TABLE public.waist_id_seq OWNER TO postgres;
        
        --
        -- TOC entry 217 (class 1259 OID 26037)
        -- Name: waist_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
        --
        
        CREATE SEQUENCE IF NOT EXISTS public.waist_id_seq1
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
        
        
        ALTER TABLE public.waist_id_seq1 OWNER TO postgres;
        
        --
        -- TOC entry 3366 (class 0 OID 0)
        -- Dependencies: 217
        -- Name: waist_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
        --
        
        ALTER SEQUENCE public.waist_id_seq1 OWNED BY public.waist.id;
        
        
        --
        -- TOC entry 216 (class 1259 OID 26031)
        -- Name: weight; Type: TABLE; Schema: public; Owner: postgres
        --
        
        CREATE TABLE public.weight (
            id integer NOT NULL,
            userid integer NOT NULL,
            value double precision,
            date date,
            method_id integer
        );
        
        
        ALTER TABLE public.weight OWNER TO postgres;
        
        --
        -- TOC entry 215 (class 1259 OID 26030)
        -- Name: weight_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
        --
        
        CREATE SEQUENCE IF NOT EXISTS public.weight_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
        
        
        ALTER TABLE public.weight_id_seq OWNER TO postgres;
        
        --
        -- TOC entry 3367 (class 0 OID 0)
        -- Dependencies: 215
        -- Name: weight_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
        --
        
        ALTER SEQUENCE public.weight_id_seq OWNED BY public.weight.id;
        
        
        --
        -- TOC entry 3192 (class 2604 OID 26056)
        -- Name: hips id; Type: DEFAULT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.hips ALTER COLUMN id SET DEFAULT nextval('public.hips_id_seq1'::regclass);
        
        
        --
        -- TOC entry 3191 (class 2604 OID 26041)
        -- Name: waist id; Type: DEFAULT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.waist ALTER COLUMN id SET DEFAULT nextval('public.waist_id_seq1'::regclass);
        
        
        --
        -- TOC entry 3190 (class 2604 OID 26034)
        -- Name: weight id; Type: DEFAULT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.weight ALTER COLUMN id SET DEFAULT nextval('public.weight_id_seq'::regclass);
        
        
        --
        -- TOC entry 3348 (class 0 OID 25985)
        -- Dependencies: 209
        -- Data for Name: add; Type: TABLE DATA; Schema: public; Owner: postgres
        --
        
        INSERT INTO public.add (id, image, link, count, text) VALUES (4, 'https://img.icons8.com/officel/160/null/react.png', 'https://icons8.com/icon/wPohyHO_qO1a/react', 0, 'React icon by Icons8');
        INSERT INTO public.add (id, image, link, count, text) VALUES (1, 'https://img.icons8.com/nolan/96/tank.png', 'https://icons8.com/icon/HjAC7fEt0292/tank', 0, 'Tank icon by Icons8');
        INSERT INTO public.add (id, image, link, count, text) VALUES (2, 'https://img.icons8.com/nolan/96/off-road-car.png', 'https://icons8.com/icon/KfIFow7SVGHN/off-road-car', 0, 'Off Road Car icon by Icons8');
        INSERT INTO public.add (id, image, link, count, text) VALUES (3, 'https://img.icons8.com/external-vitaliy-gorbachev-blue-vitaly-gorbachev/60/null/external-spaceship-space-vitaliy-gorbachev-blue-vitaly-gorbachev-2.png', 'https://icons8.com/icon/ddcAQ1Av4OLt/spaceship', 0, 'Spaceship icon by Icons8');
        INSERT INTO public.add (id, image, link, count, text) VALUES (5, 'https://img.icons8.com/fluency/188/000000/typescript--v1.png', 'https://icons8.com/icon/nCj4PvnCO0tZ/typescript', 0, 'TypeScript icon by Icons8');
        
        
        --
        -- TOC entry 3359 (class 0 OID 26053)
        -- Dependencies: 220
        -- Data for Name: hips; Type: TABLE DATA; Schema: public; Owner: postgres
        --
        
        INSERT INTO public.hips (id, userid, value, date, method_id) VALUES (2, 2, 69, '2022-12-01', 2);
        
        
        --
        -- TOC entry 3350 (class 0 OID 25997)
        -- Dependencies: 211
        -- Data for Name: methods; Type: TABLE DATA; Schema: public; Owner: postgres
        --
        
        INSERT INTO public.methods (name, description, user_id, id) VALUES ('Vrhanie tieňa', 'Fyzická aktivita vytrvalostného charakteru', 2, 1);
        INSERT INTO public.methods (name, description, user_id, id) VALUES ('Skákanie do reči', 'Anaeróbny alaktátový výkon', 2, 2);
        INSERT INTO public.methods (name, description, user_id, id) VALUES ('Lezenie na nervy', 'Vytrvalostno-silový šport', 2, 3);
        
        
        --
        -- TOC entry 3351 (class 0 OID 26002)
        -- Dependencies: 212
        -- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
        --
        
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (2, 'Emil Igelitka', 'priroda', 'emil.igelitka@gmail.com', 22, 192, 82);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (3, 'Štefan Nátierka', 'tuniakova', 'stefan.natierka@gmail.com', 21, 178, 78);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (4, 'Peter Paprika', 'zelenina', 'peter.paprika@gmail.com', 40, 180, 90);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (5, 'Samo Chladnička', 'electrolux', 'samo.chladnicka@gmail.com', 15, 185, 65);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (6, 'Peter Plott', 'dreveny', 'peter.plott@gmail.com', 35, 170, 77);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (7, 'Pavol Komín', 'kominar', 'pavol.komin@gmail.com', 60, 175, 90);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (8, 'Gejza McPillier', 'betonovy', 'gejza.pillier@gmail.com', 30, 200, 105);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (9, 'Igor Šach', 'strelec', 'igor.sach@gmail.com', 35, 168, 85);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (1, 'Admin', 'admin', NULL, 0, NULL, NULL);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (19, 'Account', 'best password', 'account@gmail.com', NULL, NULL, NULL);
        INSERT INTO public.users (id, name, password, email, age, height, weight) VALUES (23, 'Maxik', 'taxik', 'maxik@taxik.com', 16, 165, 65);
        
        
        --
        -- TOC entry 3357 (class 0 OID 26038)
        -- Dependencies: 218
        -- Data for Name: waist; Type: TABLE DATA; Schema: public; Owner: postgres
        --
        
        INSERT INTO public.waist (id, userid, value, date, method_id) VALUES (1, 2, 75, '2022-12-01', 2);
        
        
        --
        -- TOC entry 3355 (class 0 OID 26031)
        -- Dependencies: 216
        -- Data for Name: weight; Type: TABLE DATA; Schema: public; Owner: postgres
        --
        
        INSERT INTO public.weight (id, userid, value, date, method_id) VALUES (2, 2, 83, '2022-11-26', 1);
        INSERT INTO public.weight (id, userid, value, date, method_id) VALUES (3, 2, 84, '2022-11-27', 1);
        INSERT INTO public.weight (id, userid, value, date, method_id) VALUES (4, 2, 85, '2022-11-28', 1);
        INSERT INTO public.weight (id, userid, value, date, method_id) VALUES (5, 2, 82, '2022-11-25', 1);
        INSERT INTO public.weight (id, userid, value, date, method_id) VALUES (6, 1, 69, '2022-12-01', 6);
        INSERT INTO public.weight (id, userid, value, date, method_id) VALUES (7, 2, 84, '2022-11-28', 3);
        
        
        --
        -- TOC entry 3368 (class 0 OID 0)
        -- Dependencies: 210
        -- Name: hips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
        --
        
        SELECT pg_catalog.setval('public.hips_id_seq', 10, true);
        
        
        --
        -- TOC entry 3369 (class 0 OID 0)
        -- Dependencies: 219
        -- Name: hips_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
        --
        
        SELECT pg_catalog.setval('public.hips_id_seq1', 4, true);
        
        
        --
        -- TOC entry 3370 (class 0 OID 0)
        -- Dependencies: 213
        -- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
        --
        
        SELECT pg_catalog.setval('public.users_id_seq', 72, true);
        
        
        --
        -- TOC entry 3371 (class 0 OID 0)
        -- Dependencies: 214
        -- Name: waist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
        --
        
        SELECT pg_catalog.setval('public.waist_id_seq', 11, true);
        
        
        --
        -- TOC entry 3372 (class 0 OID 0)
        -- Dependencies: 217
        -- Name: waist_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
        --
        
        SELECT pg_catalog.setval('public.waist_id_seq1', 2, true);
        
        
        --
        -- TOC entry 3373 (class 0 OID 0)
        -- Dependencies: 215
        -- Name: weight_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
        --
        
        SELECT pg_catalog.setval('public.weight_id_seq', 12, true);
        
        
        --
        -- TOC entry 3194 (class 2606 OID 26014)
        -- Name: add add_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.add
            ADD CONSTRAINT add_pkey PRIMARY KEY (id);
        
        
        --
        -- TOC entry 3208 (class 2606 OID 26058)
        -- Name: hips hips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.hips
            ADD CONSTRAINT hips_pkey PRIMARY KEY (id);
        
        
        --
        -- TOC entry 3196 (class 2606 OID 26020)
        -- Name: methods methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.methods
            ADD CONSTRAINT methods_pkey PRIMARY KEY (id);
        
        
        --
        -- TOC entry 3198 (class 2606 OID 26022)
        -- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.users
            ADD CONSTRAINT users_email_key UNIQUE (email);
        
        
        --
        -- TOC entry 3200 (class 2606 OID 26024)
        -- Name: users users_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.users
            ADD CONSTRAINT users_name_key UNIQUE (name);
        
        
        --
        -- TOC entry 3202 (class 2606 OID 26026)
        -- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.users
            ADD CONSTRAINT users_pkey PRIMARY KEY (id);
        
        
        --
        -- TOC entry 3206 (class 2606 OID 26043)
        -- Name: waist waist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.waist
            ADD CONSTRAINT waist_pkey PRIMARY KEY (id);
        
        
        --
        -- TOC entry 3204 (class 2606 OID 26036)
        -- Name: weight weight_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
        --
        
        ALTER TABLE ONLY public.weight
            ADD CONSTRAINT weight_pkey PRIMARY KEY (id);
        
        
        -- Completed on 2022-12-03 19:49:54
        
        --
        -- PostgreSQL database dump complete
        --
        
        
            `)

    } catch (e) {
        console.log(e)
        console.log('failed to build database')
    }
}



module.exports = build