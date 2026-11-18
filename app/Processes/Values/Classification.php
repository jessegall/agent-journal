<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;

/**
 * The classification of one shell tree (doc 21 revision 6, section 26): every executable part with its facts, and the
 * facts the shell syntax gives by itself, a redirect's or a background job's, which belong to no part's program. The
 * classes a command needs are the union of all of them, each traceable to the facts that gave it.
 */
final readonly class Classification
{
    /**
     * @param  list<PartClassification>  $parts
     * @param  list<ClassFact>  $syntaxFacts
     */
    public function __construct(
        public ShellTree $tree,
        public array $parts,
        public array $syntaxFacts,
    ) {}

    public function requiredClasses(): CommandClassSet
    {
        return CommandClassSet::of(...array_map(fn (ClassFact $fact): CommandClass => $fact->class, $this->facts()));
    }

    /**
     * Every class fact of the command, the parts' first and then the syntax's, which say where each required class
     * comes from.
     *
     * @return list<ClassFact>
     */
    public function facts(): array
    {
        $partFacts = array_merge(...array_map(fn (PartClassification $part): array => $part->facts, $this->parts));

        return [...$partFacts, ...$this->syntaxFacts];
    }

    /**
     * The facts that give one class.
     *
     * @return list<ClassFact>
     */
    public function factsFor(CommandClass $class): array
    {
        return array_values(array_filter($this->facts(), fn (ClassFact $fact): bool => $fact->class === $class));
    }

    /**
     * Whether a part is a test or check, which waits for the end of its plan phase.
     */
    public function hasVerification(): bool
    {
        return array_any(
            $this->parts,
            fn (PartClassification $part): bool => $part->purpose === CommandType::Verification,
        );
    }

    public function isKnown(): bool
    {
        return $this->unresolved() === [];
    }

    /**
     * @return list<UnresolvedFact>
     */
    public function unresolved(): array
    {
        return array_merge(...array_map(fn (PartClassification $part): array => $part->unresolved, $this->parts));
    }

    /**
     * Whether the command may change files: an unknown command may, and so may one that needs a file-changing class.
     */
    public function mayChangeFiles(): bool
    {
        return ! $this->isKnown() || array_any(
            $this->requiredClasses()->classes,
            fn (CommandClass $class): bool => $class->isFileChange(),
        );
    }

    /**
     * Whether the command must run through a saved alias: an unknown command must, and so must a part whose purpose
     * needs one.
     */
    public function needsAlias(): bool
    {
        return ! $this->isKnown() || array_any(
            $this->parts,
            fn (PartClassification $part): bool => $part->purpose->needsAlias(),
        );
    }

    /**
     * The classification as plain data, as the shell corpus freezes it: whether it is known, the classes it needs and,
     * per part, its program, purpose, unresolved reasons and contract tools.
     *
     * @return array{
     *     known: bool,
     *     classes: list<string>,
     *     parts: list<array{program: string|null, purpose: string, unresolved: list<string>, tools: list<string>}>,
     * }
     */
    public function summary(): array
    {
        return [
            'known' => $this->isKnown(),
            'classes' => $this->requiredClasses()->toArray(),
            'parts' => array_map(fn (PartClassification $part): array => $part->summary(), $this->parts),
        ];
    }

    /**
     * A part's words as an argv; a word only known when it runs is empty here.
     *
     * @return list<string>
     */
    public function argvOf(PartClassification $part): array
    {
        return array_map(fn (Word $word) => (string) $word->literal(), $this->tree->node($part->node)->words);
    }
}
