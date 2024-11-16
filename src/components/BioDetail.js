export const BioDetail = ({ content, institute, link, details }) => (
    <li>
        {/* Main paragraph */}
        <p className="text-lg font-semibold">
            {content}{" "}
            <a
                href={link}
                className="font-bold text-red-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                {institute}
            </a>.
        </p>

        {/* Conditional details section */}
        {details && (
            <ul className="ml-6 list-disc mt-4">
                {details.map((detail, index) => (
                    <li key={index} className="text-lg font-semibold">
                        {detail}
                    </li>
                ))}
            </ul>
        )}
    </li>
);
