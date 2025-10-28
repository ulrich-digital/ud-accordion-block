import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";

const slugify = (str) =>
	str
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");

export default function save({ attributes }) {
	const { title, initiallyOpen, tags = "[]" } = attributes;

	// 🔧 Richtig: tags ist ein String, wir parsen es
	const tagArray = (() => {
		try {
			return JSON.parse(tags);
		} catch {
			return [];
		}
	})();

	const blockProps = useBlockProps.save({
		className: `ud-accordion${initiallyOpen ? " is-open" : ""}`,
		...(tagArray.length > 0 && {
			"data-tags": tags,
			"data-tags-slug": JSON.stringify(tagArray.map(slugify)),
		}),
	});

	return (
		<div {...blockProps}>
			<div className="ud-accordion__title">
				<RichText.Content
					tagName="h3"
					className="ud-accordion__toggle wp-block-heading"
					value={title}
				/>
				<span
					className={`ud-accordion__icon${
						initiallyOpen ? " is-open" : ""
					}`}
				>
					<i className="fa-sharp fa-solid fa-arrow-right-long"></i>
				</span>
			</div>

			<div className="ud-accordion__content">
				<div className="ud-accordion__content-inner">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
