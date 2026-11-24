/**
 * Compares a component, a section or a whole page of the app with the same part of its design, and says where they
 * differ: padding, borders, distances, texts, line alignment and the pixels.
 *
 *   node --experimental-strip-types tools/design-compare/compare.ts tools/design-compare/views/settings-general.json
 *
 * A view file names both sides. Each side has a "url" (a web address, or a file such as the design's index.html),
 * "steps" taken before the capture (click, fill, press, wait, evaluate, goto), "hide" (selectors drawn invisible, such
 * as clocks) and "part", the selector of the component or section to compare; with no part the whole page is compared.
 * "labels" maps an app text to the design's word for it, so wording alone never shows as a difference. "pairing" is
 * "text" (the default: elements pair by what they say) or "order" (they pair by place, for a part that shows other
 * content on each side, such as a list row filled with other tasks). "width",
 * "height" and "theme" (light or dark) set the window both sides open in. A step value may name an environment
 * variable as ${NAME}, such as a password. "accepted" lists differences that stay on purpose, each as its report line
 * without the leading dash ("\"Send\" (button) x") and a reason; they are left out of the count. The pictures and the
 * report land in storage/design-compare/<view name>/, and each run writes the view's line in record.json: when it ran,
 * the hash of the design it ran against and the differences left.
 *
 *   {"name": "settings-general", "width": 1440, "height": 900, "theme": "dark",
 *    "labels": {"What this journal is called.": "How this journal names itself."},
 *    "design": {"url": "docs/designs/home-v6/index.html", "steps": [{"click": "role=button[name='Settings']"}],
 *               "part": "section[aria-label='General']"},
 *    "app": {"url": "http://localhost:54700/settings", "steps": [{"login": "owner@journal.local"}],
 *            "part": "section[aria-label='General']"}}
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import pixelmatch from 'pixelmatch';
import { chromium, type Page } from 'playwright';
import { PNG } from 'pngjs';
import {
    alignmentDifferences,
    type CapturedElement,
    type Difference,
    differencesOf,
    differingAreas,
    gapDifferences,
    pairElements,
} from './comparison.ts';
import { designHash, readRecords, RECORD_FILE } from './record.ts';
import type { ViewRecord } from './record.ts';

type Step =
    | { click: string }
    | { fill: [string, string] }
    | { press: string }
    | { wait: number }
    | { goto: string }
    | { evaluate: string }
    | { login: string; password?: string };

type Side = { url: string; steps?: Step[]; hide?: string[]; part?: string };

type View = {
    name: string;
    width?: number;
    height?: number;
    theme?: 'light' | 'dark';
    labels?: Record<string, string>;
    pairing?: 'text' | 'order';
    accepted?: { difference: string; reason: string }[];
    design: Side;
    app: Side;
};


/** The styles a text is measured by. */
const TEXT_STYLES = [
    'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'word-spacing', 'font-feature-settings',
    'font-variation-settings', 'font-optical-sizing', 'font-kerning', 'text-rendering', 'color',
];

/** The styles a drawn box is measured by: its padding, border, corners and fill. */
const BOX_STYLES = [
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'border-top-color', 'border-radius', 'background-color',
];

const viewPath = process.argv[2];

if (viewPath === undefined) {
    console.error('Name a view file: node --experimental-strip-types tools/design-compare/compare.ts <view.json>');
    process.exit(2);
}

const view = JSON.parse(readFileSync(viewPath, 'utf8')) as View;
const folder = resolve('storage/design-compare', view.name);
// One signed-in session kept across views, so a run of many views does not sign in often enough to be throttled.
const sessionPath = resolve('storage/design-compare/session.json');
mkdirSync(folder, { recursive: true });

const browser = await chromium.launch();

try {
    const design = await capture(view.design, {});
    const app = await capture(view.app, view.labels ?? {});
    const { pairs, onlyInDesign, onlyInApp } = pairElements(design.elements, app.elements, view.pairing ?? 'text');
    const placedPairs = pairs.filter(([designElement]) => designElement.role !== 'part');
    const accepted = new Set((view.accepted ?? []).map((each) => each.difference));
    const differences: Difference[] = [
        ...pairs.flatMap(([designElement, appElement]) => differencesOf(designElement, appElement)),
        ...gapDifferences(placedPairs),
        ...alignmentDifferences(placedPairs),
    ].filter((found) => !accepted.has(`"${found.text}" (${found.role}) ${found.measure}`));
    const areas = drawPixelDifferences(design.picture, app.picture);

    record(differences.length + onlyInDesign.length + onlyInApp.length);

    writeFileSync(resolve(folder, 'report.json'), JSON.stringify({ differences, onlyInDesign, onlyInApp, areas }, null, 2));
    writeFileSync(resolve(folder, 'report.md'), reportOf(differences, onlyInDesign, onlyInApp, areas.length));
    console.log(reportOf(differences, onlyInDesign, onlyInApp, areas.length));
    console.log(`Pictures and the full report: ${folder}`);
} finally {
    await browser.close();
}

/** Opens one side, takes its steps, swaps its labels, and records its part's elements and its picture. */
async function capture(side: Side, labels: Record<string, string>): Promise<{ elements: CapturedElement[]; picture: PNG }> {
    const page = await browser.newPage({
        viewport: { width: view.width ?? 1440, height: view.height ?? 900 },
        colorScheme: view.theme ?? 'dark',
        storageState: existsSync(sessionPath) ? sessionPath : undefined,
    });

    await page.goto(addressOf(side.url));
    await page.waitForLoadState('networkidle');

    for (const step of side.steps ?? []) {
        await take(page, step);
    }

    const part = side.part ?? 'body';
    await page
        .locator(part)
        .first()
        .waitFor({ timeout: 15000 })
        .catch(async (failure: Error) => {
            await page.screenshot({ path: resolve(folder, 'not-found.png') });
            throw new Error(`${part} is not on ${page.url()}; the page as it stood is in ${folder}/not-found.png`, {
                cause: failure,
            });
        });
    const elements = await page.evaluate(measure, {
        part,
        labels,
        hide: side.hide ?? [],
        textStyles: TEXT_STYLES,
        boxStyles: BOX_STYLES,
    });
    const picture = PNG.sync.read(await page.locator(part).first().screenshot({ animations: 'disabled' }));
    await page.close();

    return { elements, picture };
}

async function take(page: Page, step: Step): Promise<void> {
    if ('click' in step) {
        await page.locator(step.click).first().click();
    } else if ('fill' in step) {
        await page.locator(step.fill[0]).first().fill(withEnvironment(step.fill[1]));
    } else if ('press' in step) {
        await page.keyboard.press(step.press);
    } else if ('wait' in step) {
        await page.waitForTimeout(step.wait);
    } else if ('goto' in step) {
        await page.goto(addressOf(step.goto));
    } else if ('evaluate' in step) {
        await page.evaluate(step.evaluate);
    } else if ((await page.locator('input[type=password]').count()) === 0) {
        // The kept session is still signed in, so the sign-in page sent it on.
        return;
    } else {
        await page.locator('input[type=email], input[name=email]').first().fill(withEnvironment(step.login));
        await page.locator('input[type=password]').first().fill(withEnvironment(step.password ?? '${COMPARE_PASSWORD}'));
        const signInPage = page.url();
        await page.locator('button[type=submit], form button').last().click();
        await page.waitForURL((address) => address.href !== signInPage);
        await page.waitForLoadState('networkidle');
        await page.context().storageState({ path: sessionPath });
        return;
    }

    await page.waitForLoadState('networkidle');
}

/**
 * Runs in the page: hides what the view hides, swaps the labels inside the part, and records two kinds of element,
 * each placed relative to the part. A text is the words an element holds itself, measured where the words are drawn,
 * with its font and colour. A box is an element drawn with a border, a fill or as a control, named by the first words
 * inside it, with its padding, border, corners and fill.
 */
function measure({
    part,
    labels,
    hide,
    textStyles,
    boxStyles,
}: {
    part: string;
    labels: Record<string, string>;
    hide: string[];
    textStyles: string[];
    boxStyles: string[];
}): CapturedElement[] {
    for (const selector of hide) {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => (element.style.visibility = 'hidden'));
    }

    const root = document.querySelector(part)!;
    const swap = (text: string): string => {
        const words = text.trim();

        return words !== '' && labels[words] !== undefined ? text.replace(words, labels[words]) : text;
    };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
        node.textContent = swap(node.textContent ?? '');
    }

    root.querySelectorAll<HTMLInputElement>('input, textarea').forEach((field) => {
        field.value = swap(field.value);
        field.placeholder = swap(field.placeholder);
    });

    const origin = root.getBoundingClientRect();
    const elements: CapturedElement[] = [];
    const typeface = getComputedStyle(root).fontFamily.split(',')[0].trim();
    const typefaceStyle = { typeface, 'typeface loaded': String(document.fonts.check(`13px ${typeface}`)) };
    elements.push({ text: '[part] typeface', role: 'part', x: 0, y: 0, width: 0, height: 0, style: typefaceStyle });
    const styleOf = (element: Element, names: string[]): Record<string, string> => {
        const computed = getComputedStyle(element);

        return Object.fromEntries(names.map((name) => [name, computed.getPropertyValue(name)]));
    };
    const record = (text: string, role: string, box: DOMRect, style: Record<string, string>): void => {
        elements.push({
            text,
            role,
            x: box.left - origin.left,
            y: box.top - origin.top,
            width: box.width,
            height: box.height,
            style,
        });
    };

    for (const element of [root, ...root.querySelectorAll<HTMLElement>('*')]) {
        const box = element.getBoundingClientRect();
        const computed = getComputedStyle(element);

        if (box.width === 0 || box.height === 0 || computed.visibility === 'hidden') {
            continue;
        }

        const role = element.getAttribute('role') ?? element.tagName.toLowerCase();
        const ownWords = [...element.childNodes].filter(
            (child) => child.nodeType === Node.TEXT_NODE && (child.textContent ?? '').trim() !== '',
        );

        if (ownWords.length > 0) {
            const range = document.createRange();
            range.setStartBefore(ownWords[0]);
            range.setEndAfter(ownWords[ownWords.length - 1]);
            const text = ownWords.map((child) => child.textContent ?? '').join(' ');
            record(text, role, range.getBoundingClientRect(), styleOf(element, textStyles));
        }

        const isControl = element.matches('input, textarea, select, button, [role=switch], [role=checkbox]');
        const hasBorder = ['top', 'right', 'bottom', 'left'].some(
            (side) => parseFloat(computed.getPropertyValue(`border-${side}-width`)) > 0,
        );
        const hasFill = !['rgba(0, 0, 0, 0)', 'transparent'].includes(computed.backgroundColor);

        if (!isControl && !hasBorder && !hasFill) {
            continue;
        }

        const field = element as HTMLInputElement;
        const name = (
            (isControl ? field.value || element.getAttribute('aria-label') : null) ||
            element.innerText ||
            element.getAttribute('aria-label') ||
            ''
        )
            .split('\n')[0]
            .trim();
        const style = styleOf(element, boxStyles);

        if (!hasBorder) {
            delete style['border-top-color'];
        }

        record(`[${role}] ${name}`, 'box', box, style);
    }

    return elements;
}

/** Writes both pictures, the difference and the app picture with the differing areas boxed; returns the areas. */
function drawPixelDifferences(design: PNG, app: PNG): ReturnType<typeof differingAreas> {
    const width = Math.max(design.width, app.width);
    const height = Math.max(design.height, app.height);
    const [designCanvas, appCanvas] = [placed(design, width, height), placed(app, width, height)];
    const difference = new PNG({ width, height });
    pixelmatch(designCanvas.data, appCanvas.data, difference.data, width, height, { threshold: 0.1 });

    const differs = (x: number, y: number): boolean => {
        const at = (y * width + x) * 4;

        return difference.data[at] === 255 && difference.data[at + 1] === 0 && difference.data[at + 2] === 0;
    };
    const areas = differingAreas(differs, width, height);
    const boxed = placed(app, width, height);

    for (const area of areas) {
        for (let x = area.x; x < area.x + area.width; x++) {
            paint(boxed, x, area.y);
            paint(boxed, x, area.y + area.height - 1);
        }

        for (let y = area.y; y < area.y + area.height; y++) {
            paint(boxed, area.x, y);
            paint(boxed, area.x + area.width - 1, y);
        }
    }

    writeFileSync(resolve(folder, 'design.png'), PNG.sync.write(designCanvas));
    writeFileSync(resolve(folder, 'app.png'), PNG.sync.write(appCanvas));
    writeFileSync(resolve(folder, 'difference.png'), PNG.sync.write(difference));
    writeFileSync(resolve(folder, 'app-boxed.png'), PNG.sync.write(boxed));

    return areas;
}

/** A picture drawn at the top left of a white canvas of the size given, so two pictures of different sizes compare. */
function placed(picture: PNG, width: number, height: number): PNG {
    const canvas = new PNG({ width, height, fill: true });
    canvas.data.fill(255);
    PNG.bitblt(picture, canvas, 0, 0, picture.width, picture.height, 0, 0);

    return canvas;
}

function paint(picture: PNG, x: number, y: number): void {
    const at = (y * picture.width + x) * 4;
    [picture.data[at], picture.data[at + 1], picture.data[at + 2], picture.data[at + 3]] = [255, 0, 80, 255];
}

function reportOf(differences: Difference[], onlyInDesign: CapturedElement[], onlyInApp: CapturedElement[], areaCount: number): string {
    const lines = [
        `# ${view.name}: ${differences.length} differences, ${areaCount} areas whose pixels differ`,
        '',
        ...differences.map((found) => `- "${found.text}" (${found.role}) ${found.measure}: design ${found.design}, app ${found.app}`),
    ];

    if (onlyInDesign.length > 0) {
        lines.push('', '## Only in the design', ...onlyInDesign.map((element) => `- "${element.text}" (${element.role})`));
    }

    if (onlyInApp.length > 0) {
        lines.push('', '## Only in the app', ...onlyInApp.map((element) => `- "${element.text}" (${element.role})`));
    }

    return `${lines.join('\n')}\n`;
}

/** Writes this view's line in the record: when it ran, against which design, and how many differences it left. */
function record(differencesLeft: number): void {
    const records = readRecords();
    records[view.name] = { ranAt: new Date().toISOString(), designHash: designHash(), differencesLeft };

    writeFileSync(RECORD_FILE, `${JSON.stringify(sortedByKey(records), null, 4)}\n`);
}

function sortedByKey(records: Record<string, ViewRecord>): Record<string, ViewRecord> {
    return Object.fromEntries(Object.entries(records).sort(([one], [other]) => one.localeCompare(other)));
}

/** A web address as it is, or a file path as a file address. */
function addressOf(url: string): string {
    return /^[a-z]+:/.test(url) ? url : pathToFileURL(isAbsolute(url) ? url : resolve(url)).href;
}

function withEnvironment(value: string): string {
    return value.replace(/\$\{(\w+)\}/g, (_, name: string) => process.env[name] ?? '');
}
