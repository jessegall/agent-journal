<?php

declare(strict_types=1);

namespace App\Processes\Values;

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
     */
    public function __construct(
        public int $node,
        public array $facts,
        public array $unresolved,
        public CommandType $purpose,
        public ProgramIdentity|null $program = null,
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
}
