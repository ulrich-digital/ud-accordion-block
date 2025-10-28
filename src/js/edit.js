import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	RichText,
} from "@wordpress/block-editor";
import {
	ToggleControl,
	FormTokenField,
	PanelBody
} from "@wordpress/components";
import { Fragment, useState, useRef, useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";

const REST_NONCE = window.udAccordionBlockSettings?.nonce || "";

export default function Edit({ attributes, setAttributes, clientId }) {
	const parentClientIds = useSelect(
		(select) =>
			select("core/block-editor").getBlockParentsByBlockName(
				clientId,
				"ud/accordion-block"
			),
		[clientId]
	);

	const isTooDeep = parentClientIds.length > 1;
	useEffect(() => {
		if (isTooDeep) {
			console.warn("⛔ Der Accordion-Block ist zu tief verschachtelt!");
		}
	}, [parentClientIds]);

	if (isTooDeep) {
		return (
			<div {...useBlockProps()} style={{ border: '1px solid #ccd0d4', borderRadius: '8px', padding: '1rem', background: '#f8f9f9' }}>
				<p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', margin: 0 }}>
					ℹ️&nbsp;
					<strong>Hinweis:</strong> Aus redaktionellen Gründen ist nur eine einmalige Verschachtelung des Akkordeon-Blocks erlaubt.
				</p>
			</div>
		);
	}

	const { title, initiallyOpen, tags = "[]" } = attributes;
	const [isOpen, setIsOpen] = useState(() => initiallyOpen);
	const richTextRef = useRef(null);
	const contentRef = useRef(null);

	const tagArray = (() => {
		try {
			return JSON.parse(tags);
		} catch {
			return [];
		}
	})();

	const [globalTags, setGlobalTags] = useState([]);

	useEffect(() => {
		fetch("/wp-json/ud-shared/v1/tags", {
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": REST_NONCE,
			},
		})
			.then((res) => res.json())
			.then((tags) => {

				if (Array.isArray(tags)) {
					setGlobalTags(tags);
				}
			})
			.catch((err) => {
				console.warn("Fehler beim Laden der Tags:", err);
			});
	}, []);

	const ALLOWED_BLOCKS = [
		"core/heading",
		"core/paragraph",
		"core/list",
		"ud/accordion-block",
		"ud/link-block",
		"ud/contact-card-associations-music",
	];

	const blockProps = useBlockProps({
		className: `ud-accordion${isOpen ? " is-open" : ""}`,
	});

	const handleToggle = (event) => {
		if (richTextRef.current?.contains(event.target)) return;
		setIsOpen((prev) => !prev);
	};

	useEffect(() => {
		if (!contentRef.current) return;
		const el = contentRef.current;

		if (isOpen) {
			el.style.height = "auto";
			const scrollHeight = el.scrollHeight;
			el.style.height = "0px";
			void el.offsetHeight;
			el.style.height = `${scrollHeight}px`;

			const timeout = setTimeout(() => {
				el.style.height = "auto";
			}, 300);
			return () => clearTimeout(timeout);
		} else {
			const currentHeight = el.scrollHeight;
			el.style.height = `${currentHeight}px`;
			void el.offsetHeight;
			el.style.height = "0px";
		}
	}, [isOpen]);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Tags" initialOpen={true}>
<FormTokenField
	label="Tags hinzufügen"
	value={tagArray}
	suggestions={globalTags}
	__next40pxDefaultSize={true}
	__nextHasNoMarginBottom={true}
	onFocus={() => {
		console.log("🔁 Fokus → Tags nachladen");
		fetch("/wp-json/ud-shared/v1/tags", {
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": REST_NONCE,
			},
		})
			.then((res) => res.json())
			.then((tags) => {
				if (Array.isArray(tags)) {
					console.log("📦 Aktualisierte Vorschläge:", tags);
					setGlobalTags(tags);
				}
			})
			.catch((err) =>
				console.warn("❌ Fehler beim Nachladen der Tags:", err)
			);

	}}
	onChange={(newTags) => {
		setAttributes({ tags: JSON.stringify(newTags) });

		newTags.forEach((tag) => {
			if (!globalTags.includes(tag)) {
				fetch("/wp-json/ud-shared/v1/tags", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-WP-Nonce": REST_NONCE,
					},
					body: JSON.stringify({ name: tag }),
				})
					.then((res) => res.json())
					.then((tags) => {
						if (Array.isArray(tags)) {
							setGlobalTags(tags);
						}
					})
					.catch((err) =>
						console.warn("Tag konnte nicht gespeichert werden", err)
					);
			}
		});
	}}
/>

				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div
					className="ud-accordion__title"
					onClick={handleToggle}
					style={{ cursor: "pointer" }}
				>
					<RichText
						tagName="h3"
						className="ud-accordion__toggle wp-block-heading"
						value={title}
						placeholder={__("Details", "ud-accordion-block")}
						onChange={(value) => setAttributes({ title: value })}
						allowedFormats={[]}
						ref={richTextRef}
						__next40pxDefaultSize={true}
					/>
					<span className={`ud-accordion__icon${isOpen ? " is-open" : ""}`}>
						<i className="fa-sharp fa-solid fa-arrow-right-long"></i>
					</span>
				</div>

				<ToggleControl
					label={__("Standardmässig geöffnet anzeigen", "ud-accordion-block")}
					checked={initiallyOpen}
					onChange={(value) => {
						setAttributes({ initiallyOpen: value });
						setIsOpen(value);
					}}
					className="ud-accordion__toggle-switch"
					__nextHasNoMarginBottom
				/>


				<div className="ud-accordion__content" ref={contentRef}>
					<div className="ud-accordion__content-inner">
<InnerBlocks
    allowedBlocks={ udAccordionBlockSettings?.allowedBlocks || [] }
/>
					</div>
				</div>
			</div>
		</Fragment>
	);
}



