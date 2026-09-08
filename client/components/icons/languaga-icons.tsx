import type { SVGProps } from "react";

export type LanguageName =
	| "javascript"
	| "typescript"
	| "python"
	| "java"
	| "html"
	| "css"
	| "react"
	| "node";

type LanguageIconProps = SVGProps<SVGSVGElement> & {
	language: LanguageName;
	size?: number;
	title?: string;
};

const icons: Record<LanguageName, { label: string; color: string; glyph: string }> = {
	javascript: { label: "JS", color: "#f7df1e", glyph: "JS" },
	typescript: { label: "TS", color: "#3178c6", glyph: "TS" },
	python: { label: "Python", color: "#3776ab", glyph: "Py" },
	java: { label: "Java", color: "#ed8b00", glyph: "J" },
	html: { label: "HTML", color: "#e34f26", glyph: "5" },
	css: { label: "CSS", color: "#1572b6", glyph: "3" },
	react: { label: "React", color: "#61dafb", glyph: "⚛" },
	node: { label: "Node.js", color: "#339933", glyph: "N" },
};

/** A compact, dependency-free icon for common programming languages. */
export function LanguageIcon({
	language,
	size = 24,
	title,
	...props
}: LanguageIconProps) {
	const icon = icons[language];
	const accessibleTitle = title ?? icon.label;

	return (
		<svg
			aria-label={accessibleTitle}
			height={size}
			role="img"
			viewBox="0 0 24 24"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>{accessibleTitle}</title>
			<rect fill={icon.color} height="24" rx="4" width="24" />
			<text
				dominantBaseline="central"
				fill={language === "javascript" ? "#111" : "#fff"}
				fontFamily="Arial, sans-serif"
				fontSize={language === "python" ? "8" : "10"}
				fontWeight="700"
				textAnchor="middle"
				x="12"
				y="12"
			>
				{icon.glyph}
			</text>
		</svg>
	);
}

export const JavascriptIcon = (props: Omit<LanguageIconProps, "language">) => (
	<LanguageIcon language="javascript" {...props} />
);
export const TypescriptIcon = (props: Omit<LanguageIconProps, "language">) => (
	<LanguageIcon language="typescript" {...props} />
);
export const PythonIcon = (props: Omit<LanguageIconProps, "language">) => (
	<LanguageIcon language="python" {...props} />
);
export const JavaIcon = (props: Omit<LanguageIconProps, "language">) => (
	<LanguageIcon language="java" {...props} />
);
export const HtmlIcon = (props: Omit<LanguageIconProps, "language">) => (
	<LanguageIcon language="html" {...props} />
);
export const CssIcon = (props: Omit<LanguageIconProps, "language">) => (
	<LanguageIcon language="css" {...props} />
);
export const ReactIcon = (props: Omit<LanguageIconProps, "language">) => (
	<LanguageIcon language="react" {...props} />
);
export const NodeIcon = (props: Omit<LanguageIconProps, "language">) => (
	<LanguageIcon language="node" {...props} />
);
