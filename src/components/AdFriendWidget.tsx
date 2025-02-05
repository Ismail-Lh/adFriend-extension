import type React from "react";

// Lists of positive messages.
const motivationalQuotes = [
	"Believe you can and you're halfway there.",
	"Keep going, you are making progress!",
	"Stay positive, work hard, make it happen.",
	"Your only limit is your mind.",
];

const activityReminders = [
	"Time to stretch! How about a quick walk?",
	"Take a deep breath and do some burpees!",
	"Stand up and move around – your body will thank you.",
	"Break time: Do a quick set of push-ups!",
];

function getRandomItem(arr: string[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export const AdFriendWidget: React.FC = () => {
	// Randomly choose between a motivational quote and an activity reminder.
	const message =
		Math.random() < 0.5
			? getRandomItem(motivationalQuotes)
			: getRandomItem(activityReminders);

	return (
		<div
			style={{
				backgroundColor: "#e0f7fa",
				border: "1px solid #006064",
				padding: "10px",
				margin: "10px 0",
				borderRadius: "4px",
				fontFamily: "sans-serif",
				fontSize: "14px",
				color: "#006064",
				textAlign: "center",
			}}
		>
			{message}
		</div>
	);
};
