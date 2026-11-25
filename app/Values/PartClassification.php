<?php

declare(strict_types=1);

namespace App\Values;

use App\Data\Processes\PartSummaryData;
use App\Declarations\VerificationContract;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\CommandType;
use App\Enums\CommandRules\OutputRequirement;

/**
 * What one executable part of a tree may do: its class facts, what could not be placed, and its workflow purpose.
 */
final readonly class PartClassification
{
    /**
     * @param  list<ClassFact>  $facts
     * @param  list<UnresolvedFact>  $unresolved
     * @param  ProgramIdentity|null  $program  null for a part with no program word, or one known only at run time
     * @param  list<VerificationContract>  $contracts  the contract of a test, check or build the part runs
     */
    public function __construct(
        public int $node,
        public array $facts,
        public array $unresolved,
        public CommandType $purpose,
        public ProgramIdentity|null $program = null,
        public array $contracts = [],
    ) {}

    /**
     * The part's own node in the tree it was classified from.
     */
    public function nodeIn(ShellTree $tree): ShellNode
    {
        return $tree->node($this->node);
    }

    public function classes(): CommandClassSet
    {
        return CommandClassSet::of(...array_map(fn (ClassFact $fact): CommandClass => $fact->class, $this->facts));
    }

    public function isKnown(): bool
    {
        return $this->unresolved === [];
    }

    public function outputRequirement(): OutputRequirement
    {
        return $this->purpose->outputRequirement();
    }

    /**
     * The part as plain data: its program, purpose, unresolved reasons and contract tools.
     */
    public function summary(): PartSummaryData
    {
        return PartSummaryData::from([
            'program' => $this->program?->family,
            'purpose' => $this->purpose->value,
            'unresolved' => array_map(fn (UnresolvedFact $fact): string => $fact->type->value, $this->unresolved),
            'tools' => array_map(
                fn (VerificationContract $contract): string => $contract->tool->value,
                $this->contracts,
            ),
        ]);
    }
}
