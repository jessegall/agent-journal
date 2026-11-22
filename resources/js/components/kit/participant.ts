/** Who an avatar stands for: an agent of a program, a person, you, or the journal itself. */
export interface Participant {
    kind: 'agent' | 'person' | 'you' | 'journal';
    program?: string;
    initials?: string;
    name?: string;
    role?: string;
}
