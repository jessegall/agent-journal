<?php

declare(strict_types=1);

namespace App\Values;

use App\Data\Processes\ClassificationSummaryData;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\CommandType;

/**
 * The classification of one shell tree: every executable part with its facts, and the
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
        return CommandClassSet::of(...array_map(fn (ClassFact $fact) => $fact->class, $this->facts()));
    }

    /**
     * Every class fact of the command, the parts' first and then the syntax's, which say where each required class
     * comes from.
     *
     * @return list<ClassFact>
     */
    public function facts(): array
    {
        $partFacts = array_merge(...array_map(fn (PartClassification $part) => $part->facts, $this->parts));

        return [
            ...$partFacts,
            ...$this->syntaxFacts,
        ];
    }

    /**
     * The facts that give one class.
     *
     * @return list<ClassFact>
     */
    public function factsFor(CommandClass $class): array
    {
        return array_values(array_filter($this->facts(), fn (ClassFact $fact) => $fact->class === $class));
    }

    /**
     * Whether a part is a test or check, which waits for the end of its plan phase.
     */
    public function hasVerification(): bool
    {
        return array_any(
            $this->parts,
            fn (PartClassification $part) => $part->purpose === CommandType::Verification,
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
        return array_merge(...array_map(fn (PartClassification $part) => $part->unresolved, $this->parts));
    }

    /**
     * Whether the command changes files, or could: an unknown command counts as one that does, and so does one that
     * needs a file-changing class.
     */
    public function changesFiles(): bool
    {
        return ! $this->isKnown() || array_any(
            $this->requiredClasses()->classes,
            fn (CommandClass $class) => $class->isFileChange(),
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
            fn (PartClassification $part) => $part->purpose->needsAlias(),
        );
    }

    /**
     * The classification as plain data, as the corpus freezes it and an evidence digest hashes it.
     */
    public function summary(): ClassificationSummaryData
    {
        return ClassificationSummaryData::from([
            'isKnown' => $this->isKnown(),
            'classes' => $this->requiredClasses()->values(),
            'parts' => array_map(fn (PartClassification $part) => $part->summary(), $this->parts),
        ]);
    }

    /**
     * The facts of one part: its own, and those of the syntax inside it, such as a redirect that writes a file.
     *
     * @return list<ClassFact>
     */
    public function factsOf(PartClassification $part): array
    {
        $syntaxFacts = array_filter(
            $this->syntaxFacts,
            fn (ClassFact $fact) => $this->isWithin($fact->node, $part->node),
        );

        return [
            ...$part->facts,
            ...array_values($syntaxFacts),
        ];
    }

    /**
     * The classes one part needs, its syntax included.
     */
    public function classesOf(PartClassification $part): CommandClassSet
    {
        $classes = array_map(fn (ClassFact $fact) => $fact->class, $this->factsOf($part));

        return CommandClassSet::of(...$classes);
    }

    /**
     * A part's words as an argv; a word only known when it runs is empty here.
     *
     * @return list<string>
     */
    public function argvOf(PartClassification $part): array
    {
        return array_map(fn (Word $word) => (string) $word->literal(), $part->nodeIn($this->tree)->words);
    }

    private function isWithin(int $nodeId, int $ancestorId): bool
    {
        $node = $this->tree->node($nodeId);

        while ($node->id !== $ancestorId && ! $node->isRoot) {
            $node = $this->tree->node($node->parent);
        }

        return $node->id === $ancestorId;
    }
}
