import { useState } from "react";
import styles from "../../styles/Home.module.scss";
import { session, request, loadItemId } from "../../base/request";

const Action = ({ apiData }) => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const showApiSpec = async (item) => {
    const dtId = await loadItemId('cenit_data_type', { namespace: 'Setup', name: 'ApiSpec' });

    window.parent.postMessage({
      cmd: 'openTab',
      dataTypeId: dtId,
      recordId: item.id,
      token: session.get('token'),
    }, '*');
  }

  const onClick = (e) => {
    e.preventDefault();

    setImporting(true);

    const options = {
      url: 'setup/api_spec',
      method: 'POST',
      data: { url: apiData.swaggerUrl },
      headers: { 'X-Template-Options': JSON.stringify({ viewport: { id: true, title: true } }) }
    };

    request(options).then((response) => {
      showApiSpec(response)
    }).catch((error) => {
      setError('This s could not be imported because it is not in the Openapi-v3 format required for this action.');
      console.error(error);
    }).finally(() => {
      setImporting(false);
    });
  };

  const extraClass = importing ? styles.importing : (error ? styles.error : '');

  return (
    <div
      className={`${styles.download} ${extraClass}`}
      title={error || 'Import to an internal registry in CenitIO'}
      onClick={importing ? null : onClick}
    >
      <svg viewBox="0 0 1000 1000" width="24px" height="24px">
        <g>
          <g>
            <path
              d="M806.3,928.9H193.8C92.4,928.9,10,846.5,10,745.1V377.5c0-33.9,27.4-61.3,61.2-61.3c33.9,0,61.3,27.4,61.3,61.3v367.7c0,33.8,27.5,61.3,61.3,61.3h612.5c33.8,0,61.3-27.5,61.3-61.3V377.5c0-33.9,27.4-61.3,61.3-61.3c33.8,0,61.2,27.4,61.2,61.3v367.7C990,846.5,907.6,928.9,806.3,928.9z"
            />
          </g>
          <g>
            <path
              d="M478.3,600.9c11.9,11.9,31.4,11.9,43.3,0l201.7-201.8c11.9-11.9,7.9-21.7-9-21.7h-61.3c-16.9,0-30.6-13.8-30.6-30.6V224.3c0-16.9-13.8-30.6-30.6-30.6H408.1c-16.9,0-30.6,13.8-30.6,30.6v122.5c0,16.9-13.8,30.6-30.6,30.6h-61.3c-16.9,0-20.9,9.8-9,21.7L478.3,600.9z"
            />
            <path
              d="M377.5,101.7c0-16.9,13.7-30.6,30.6-30.6c16.9,0,30.6,13.8,30.6,30.6c0,17-13.7,30.6-30.6,30.6C391.2,132.4,377.5,118.7,377.5,101.7z"
            />
            <path
              d="M561.3,101.7c0-16.9,13.7-30.6,30.6-30.6c16.9,0,30.6,13.8,30.6,30.6c0,17-13.7,30.6-30.6,30.6C575,132.4,561.3,118.7,561.3,101.7z"
            />
            <path d="M408.1,71.1h183.8v61.3H408.1V71.1L408.1,71.1z" />
            {
              importing && (
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  type="translate"
                  values="0 150; 0 -150; 0 150"
                  repeatCount="indefinite"
                  begin={0.1}
                />
              )
            }
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Action;