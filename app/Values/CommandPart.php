<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\CommandEffect;
use App\Enums\CommandRules\CommandType;
use App\Enums\Runs\PartJoin;

/**
 * One simple command of a shell line: the program, its arguments, its effect on files, what type of command it is and
 * how it joins the next part.
 */
final readonly class CommandPart
{
    /**
     * @param  list<string>  $arguments
     */
    public function __construct(
        public string $program,
        public array $arguments,
        public CommandEffect $effect,
        public CommandType $type,
        public PartJoin $join = PartJoin::End,
    ) {}
}
