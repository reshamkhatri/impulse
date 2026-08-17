import { getSection } from '@/lib/content';
import PopupEditor from '@/components/admin/PopupEditor';

export const metadata = { title: 'Welcome Popup' };

export default async function PopupAdminPage() {
  const popupSection = await getSection('site.popup');

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Welcome Popup Modal</h1>
          <p>
            Control the announcement modal displayed to first-time visitors when they open the website.
            Changes take effect immediately across all devices.
          </p>
        </div>
      </div>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Popup Configuration &amp; Content</h2>
            <p>Customize the message, call-to-action link, badge tag, and optional media.</p>
          </div>
        </div>
        <div className="adm-panel-body">
          <PopupEditor section={popupSection} />
        </div>
      </section>
    </>
  );
}
