import { describe, expect, it } from 'vitest';
import { terminalFrame } from '@/routes/web';

describe('the address of a terminal frame read', () => {
    it('names no epoch and no stream for a view that holds no frame, since the journal refuses an empty one', () => {
        const held = { interest: 'interest-1', epoch: undefined, stream: undefined, after: 0 };

        const address = terminalFrame.url('agent-1', { query: held });

        const named = [...new URL(address, 'http://journal.test').searchParams.keys()].sort();
        expect(named).toEqual(['after', 'interest']);
    });
});
