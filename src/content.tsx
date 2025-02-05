import { createRoot } from "react-dom/client";
import { AdFriendWidget } from "./components/AdFriendWidget";

// Define selectors that might indicate an ad element.
// const adSelectors = ['[id*="ad"]', '[class*="ad"]', 'iframe[src*="ads"]'];

/**
 * Determines whether an element is likely an ad based on multiple heuristics.
 * @param element The HTML element to test.
 */
function isAdElement(element: HTMLElement): boolean {
	// Keywords that commonly appear in ad-related element IDs or classes.
	const adKeywords = [
		"ad",
		"ads",
		"advert",
		"sponsor",
		"banner",
		"promo",
		"companion",
		"companionad",
		"adunit",
		"ad-container",
		"panel",
		"ad-placement",
		"ad-wrapper",
		"ad-slot",
		"ad-banner",
	];

	// Retrieve the element's properties in lowercase for easy matching
	const id = element.id.toLowerCase();
	const classNames = element.className.toLowerCase();
	const tagName = element.tagName.toLowerCase();

	// Check for keywords in id, className, or tagName
	const hasAdKeyword = adKeywords.some(
		(keyword) =>
			(id.includes(keyword) ||
				classNames.includes(keyword) ||
				tagName.includes(keyword)) &&
			// Basic exclusion: avoid cases that might be part of non-ad words
			!id.includes("header") &&
			!classNames.includes("header") &&
			!id.includes("badge"),
	);

	// Check if the element is an iframe and if its src contains a known ad network.
	let isIframeAd = false;
	if (element.tagName === "IFRAME") {
		const iframe = element as HTMLIFrameElement;
		if (iframe.src) {
			const adDomains = [
				"doubleclick.net",
				"googlesyndication.com",
				"adservice.google.com",
				"amazon-adsystem.com",
			];
			isIframeAd = adDomains.some((domain) => iframe.src.includes(domain));
		}
	}

	// Check dimensions heuristically (adjust these values as needed).
	// Many ads fall within typical banner sizes (e.g., 300x50, 728x90, etc.)
	const { offsetWidth: width, offsetHeight: height } = element;
	// Here we assume that an ad has a minimum width and height and also doesn't span the entire page.
	const sizeCondition =
		width >= 250 && width <= 800 && height >= 50 && height <= 300;

	// Optionally, inspect computed style (e.g., if element is absolutely positioned in a typical ad slot).
	// const computedStyle = window.getComputedStyle(element);
	// const isAbsolutelyPositioned = computedStyle.position === 'absolute';

	// Combine our heuristics.
	if (isIframeAd) return true;
	if (hasAdKeyword && sizeCondition) return true;

	return false;
}

// This function mounts our React widget into a container element.
function mountWidget(container: HTMLElement) {
	// Create a container div for React.
	const widgetContainer = document.createElement("div");
	// You can set an id or class here if needed.
	container.parentNode?.insertBefore(widgetContainer, container);
	// Remove the original ad element.
	container.remove();

	// Create root and render using the new API
	const root = createRoot(widgetContainer);
	root.render(<AdFriendWidget />);
}

/**
 * Searches the page for likely ad elements using our sophisticated heuristics
 * and replaces them with the AdFriend widget.
 */
function replaceAdElements() {
	// Get a broad selection of elements that might be ads. (This query is broad; we then filter.)
	const possibleAdElements = document.querySelectorAll<HTMLElement>(
		"div, iframe, section, aside",
	);

	for (const element of possibleAdElements) {
		try {
			if (isAdElement(element)) {
				mountWidget(element);
			}
		} catch (error) {
			// If any error occurs while processing an element, log it and continue.
			console.error("Error processing element for AdFriend:", error);
		}
	}
}

// Run once when the window loads.
window.addEventListener("load", () => {
	replaceAdElements();

	// Optional: Observe for dynamic content changes using MutationObserver.
	const observer = new MutationObserver(() => {
		replaceAdElements();
	});
	observer.observe(document.body, { childList: true, subtree: true });
});
