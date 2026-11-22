/** Who an avatar stands for: an agent on a driver, another user, you, or the journal itself. */
export interface Participant {
    kind: 'agent' | 'user' | 'you' | 'journal';
    driver?: string;
    initials?: string;
    name?: string;
    role?: string;
}
