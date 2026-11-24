// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TerminalView from './TerminalView.vue';

const row = (text: string) => ({ runs: [{ text, style: {} }] });

describe('TerminalView', () => {
    // The screen sits in a pre, which keeps every space and line break of the template, so
    // anything between two rows pushes them apart. The rows follow each other directly, as lines of a terminal do.
    it('draws the rows of the screen directly under each other, with nothing between them', () => {
        const view = mount(TerminalView, {
            props: {
                presentation: {
                    screen: {
                        state: 'live',
                        restarted: false,
                        refusal: null,
                        frame: {
                            columns: 20,
                            plain: false,
                            menu: null,
                            cursor: { row: 0, column: 0, visible: false },
                            rows: [row('first'), row('second'), row('third')],
                        },
                    },
                    stateLine: '',
                    notices: [],
                    ageSeconds: 0,
                },
            } as never,
        });
        const screen = view.find('pre').element;
        const between = [...screen.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);

        expect(screen.querySelectorAll(':scope > div')).toHaveLength(3);
        expect(between.map((node) => node.textContent).join('')).toHaveLength(0);
    });
});
