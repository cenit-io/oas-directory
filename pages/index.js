import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { CardList } from "../components/CardList";
import { Menu } from "../components/Menu";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import session from "../base/session";

const transformApiData = (apiData) => {
  let preferred = apiData.preferred,
    api = apiData.versions[preferred],
    info = api.info,
    externalDocs = api.externalDocs || {},
    contact = info.contact || {},
    externalUrl = externalDocs.url || contact.url,
    logo = info["x-logo"] || {},
    added = new Date(apiData.added)
      .toDateString()
      .split(" ")
      .slice(1)
      .join(" "),
    updated = new Date(api.updated)
      .toDateString()
      .split(" ")
      .slice(1)
      .join(" "),
    title = info.title,
    url = externalUrl,
    description = info.description,
    category = api.info["x-apisguru-categories"],
    version = preferred,
    swaggerUrl = api.swaggerUrl,
    swaggerYamlUrl = api.swaggerYamlUrl,
    openapiVer = api.openapiVer,
    tools = {
      swagger_ui: `http://petstore.swagger.io/?url=${swaggerUrl}`,
      swagger_editor: `http://editor.swagger.io/?url=${swaggerUrl}`,
      open_api_gui: `https://mermade.github.io/openapi-gui/?url=${swaggerUrl}`,
      stoplight_elements: `https://elements-demo.stoplight.io/?spec=${swaggerUrl}`,
    },
    origUrl;

  api.info["x-origin"]
    ? (origUrl = api.info["x-origin"][0].url)
    : (origUrl = api.swaggerUrl);

  let detail = {
    title,
    url,
    logo,
    description,
    category,
    version,
    added,
    updated,
    swaggerUrl,
    swaggerYamlUrl,
    openapiVer,
    origUrl,
    externalUrl,
    tools,
  };

  return {
    title,
    url,
    logo,
    description,
    category,
    version,
    added,
    swaggerUrl,
    detail,
  };
};

export default function Home() {
  const [authorizing, setAuthorizing] = useState(true);
  const [apis, setApis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [apiOfCategory, setApiOfCategory] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;

    fetch("https://api.apis.guru/v2/list.json")
      .then((response) => response.json())
      .then((json) => Object.values(json).map((api) => transformApiData(api)))
      .then((data) => {
        setApis(data);
        setApiOfCategory(data);
        let apiCategories = data
          .map((api) => api.category)
          .filter((c) => Boolean(c))
          .flat(Infinity)
          .sort();
        let categories = Array.from(new Set(apiCategories));
        setCategories(["all", ...categories]);
        setLoading(false);
      });
  }, [loading]);

  useEffect(() => {
    if (!authorizing) return;

    const urlParams = new URLSearchParams(window.location.search);

    // eslint-disable-next-line consistent-return
    window.addEventListener('message', (event) => {
      const { origin, data: { cmd, tenantId, access } } = event;

      if (origin !== 'https://app.cenit.io') return false;

      if (cmd === 'refresh') session.set('account', { ...session.currentAccount, tenantId });

      if (access) {
        const { access_token: accessToken, expiration_date: expirationDate } = access;
        session.set('account', { tenantId, accessToken, expirationDate });
        setAuthorizing(false);
      }
    });

    if (urlParams.has('token')) {
      const token = urlParams.get('token');
      session.set('token', token);
      window.parent.postMessage({ cmd: 'getAccess', token }, '*');
    }
  }, [authorizing]);

  useEffect(() => {
    if (currentCategory === "all") {
      setApiOfCategory(apis);
      return;
    }

    let apisOfCategory = apis.filter((api) =>
      api?.category?.join(" ").includes(currentCategory)
    );

    setApiOfCategory(apisOfCategory);
  }, [currentCategory]);

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
  };

  const handleSearchByName = (name) => {
    if (!name) {
      setCurrentCategory("all");
      setApiOfCategory(apis);
      return;
    }
    let apisOfName = apis.filter((api) => api?.title?.includes(name));
    setApiOfCategory(apisOfName);
  };

  const handleOpenModal = () => setIsOpenModal(true);

  const handleCloseModal = () => setIsOpenModal(false);

  const fillModalData = (data) => {
    setModalData(data);
  };

  return (
    <>
      <Head>
        <title>OAS-Directory</title>
        <meta name="description" content="OAS-Directory" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Headers section  */}
        <section className={styles.content_wrapper}>
          <Menu
            categories={categories}
            currentCategory={currentCategory}
            handleCategoryClick={handleCategoryClick}
          />
          <CardList
            loading={loading || authorizing}
            apis={apiOfCategory}
            handleSearchByName={handleSearchByName}
            currentCategory={currentCategory}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            fillModalData={fillModalData}
          />
        </section>

        {isOpenModal && (
          <Modal closeModal={handleCloseModal} modalData={modalData} />
        )}
      </main>
    </>
  );
}
