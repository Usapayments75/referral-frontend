import { useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';

const DEFAULT_CONTACT_LINK = 'https://usapayments.com/contact-us/';

export function useContactLink() {
	const [contactLink, setContactLink] = useState(DEFAULT_CONTACT_LINK);
	useEffect(() => {
		let mounted = true;
		const fetchContactLink = async () => {
			try {
				const settings = await settingsService.getAllSettings();
				if (!mounted) return;

				const contactSetting = settings.find(setting => setting.key === 'Contact Us');
				if (contactSetting?.value) {
					setContactLink(contactSetting.value);
				}
			} catch (error) {
				// Log error but don't break the app - use default link
				console.error('Failed to fetch contact link:', error);
			}
		};
		fetchContactLink();
		return () => {
			mounted = false;
		};
	}, []);
	return contactLink;
}