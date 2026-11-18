<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Declarations\VerificationContract;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\OutputRequirement;

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
     *
     * @return array{program: string|null, purpose: string, unresolved: list<string>, tools: list<string>}
     */
    public function summary(): array
    {
        return [
            'program' => $this->program?->family,
            'purpose' => $this->purpose->value,
            'unresolved' => array_map(fn (UnresolvedFact $fact): string => $fact->type->value, $this->unresolved),
            'tools' => array_map(fn (VerificationContract $contract): string => $contract->tool->value, $this->contracts),
        ];
    }
}
