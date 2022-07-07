import styles from "../styles/Home.module.scss";
import DownloadAction from "./actions/Download";
import ImportAction from "./actions/Import";

export const handleImgError = (e) => {
  e.target.src = "https://api.apis.guru/v2/cache/logo/https_apis.guru_assets_images_no-logo.svg";
};

export const Card = ({ apiData, handleOpenModal, fillModalData }) => {
  const {
    title,
    logo,
    description,
    category,
    version,
    added,
    detail,
  } = apiData;

  const handleApiDetail = (e, apiDetail) => {
    e.preventDefault();
    fillModalData(apiDetail);
    handleOpenModal();
  };

  return (
    <>
      <article className={styles.card}>
        <header>
          <a
            target="_blank"
            rel="noreferrer"
            onClick={(e) => handleApiDetail(e, detail)}
          >
            {title}
          </a>
        </header>
        <section>
          <div
            className={styles.panel_logo}
            style={{ backgroundColor: logo.backgroundColor }}
          >
            <a
              target="_blank"
              rel="noreferrer"
              onClick={(e) => handleApiDetail(e, detail)}
            >
              <img src={logo.url} alt="Logo" onError={handleImgError} />
            </a>
          </div>
          <div
            className={styles.panel_description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </section>
        <footer>
          <div className={styles.footer_header}>
            <span> {category} </span>
          </div>
          <div className={styles.footer_versions}>
            <div className={styles.footer_date}>
              <span>{added} </span>
            </div>
            <div className={styles.footer_version}>
              <span>{version} </span>
            </div>
          </div>
          <div className={styles.footer_action}>
            <DownloadAction apiData={apiData} />
            <ImportAction apiData={apiData} />
          </div>
        </footer>
      </article>
    </>
  );
};
