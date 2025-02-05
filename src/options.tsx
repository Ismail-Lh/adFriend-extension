import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

interface Options {
	motivationalQuotes: string;
	activityReminders: string;
	selectors: string;
	contentType: "both" | "motivational" | "activity";
}

const defaultOptions: Options = {
	motivationalQuotes:
		"Believe you can and you're halfway there.\nKeep going, you are making progress!\nStay positive, work hard, make it happen.\nYour only limit is your mind.",
	activityReminders:
		"Time to stretch! How about a quick walk?\nTake a deep breath and do some burpees!\nStand up and move around – your body will thank you.\nBreak time: Do a quick set of push-ups!",
	selectors: '[id*="ad"],[class*="ad"],iframe[src*="ads"]',
	contentType: "both",
};

export function OptionsPage() {
	const [options, setOptions] = useState<Options>(defaultOptions);
	const [status, setStatus] = useState("");

	useEffect(() => {
		// Load stored options (or use defaults if none exist).
		chrome.storage.sync.get(defaultOptions, (result) => {
			setOptions(result as Options);
		});
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setOptions((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = () => {
		chrome.storage.sync.set(options, () => {
			setStatus("Options saved.");
			setTimeout(() => setStatus(""), 1500);
		});
	};

	return (
		<div style={{ padding: "20px", fontFamily: "sans-serif" }}>
			<h1>AdFriend Options</h1>

			<div style={{ marginBottom: "10px" }}>
				<label>
					<strong>Motivational Quotes</strong> (one per line):
					<br />
					<textarea
						name="motivationalQuotes"
						value={options.motivationalQuotes}
						onChange={handleChange}
						rows={5}
						style={{ width: "100%" }}
					/>
				</label>
			</div>

			<div style={{ marginBottom: "10px" }}>
				<label>
					<strong>Activity Reminders</strong> (one per line):
					<br />
					<textarea
						name="activityReminders"
						value={options.activityReminders}
						onChange={handleChange}
						rows={5}
						style={{ width: "100%" }}
					/>
				</label>
			</div>

			<div style={{ marginBottom: "10px" }}>
				<label>
					<strong>Ad Selectors</strong> (comma-separated):
					<br />
					<input
						type="text"
						name="selectors"
						value={options.selectors}
						onChange={handleChange}
						style={{ width: "100%" }}
					/>
				</label>
			</div>

			<div style={{ marginBottom: "10px" }}>
				<label>
					<strong>Content Type</strong>:
					<br />
					<select
						name="contentType"
						value={options.contentType}
						onChange={handleChange}
						style={{ width: "100%" }}
					>
						<option value="both">Both</option>
						<option value="motivational">Motivational Only</option>
						<option value="activity">Activity Only</option>
					</select>
				</label>
			</div>

			<button onClick={handleSave} type="button">
				Save Options
			</button>
			<div style={{ marginTop: "10px", color: "green" }}>{status}</div>
		</div>
	);
}

// Before the render call
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<OptionsPage />);
