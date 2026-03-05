export function FeedbackSection({ feedback }) {
    if (!feedback) return null;

    return (
        <div className="space-y-2 text-sm">
            {feedback.positive && (
                <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5">✅</span>
                    <p className="text-gray-700">{feedback.positive}</p>
                </div>
            )}
            {feedback.watchFor && (
                <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5">⚠️</span>
                    <p className="text-gray-700">{feedback.watchFor}</p>
                </div>
            )}
            {feedback.reflect && (
                <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5">💭</span>
                    <p className="text-gray-600 italic">{feedback.reflect}</p>
                </div>
            )}
        </div>
    );
}
