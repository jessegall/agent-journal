<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Enums\CommandEffect;
use App\Core\Hooks\Enums\CommandKind;
use App\Core\Hooks\Enums\PartJoin;

/**
 * One simple command of a shell line: the program, its arguments, its effect on files, what kind of command it is and how it joins the next part.
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
        public CommandKind $kind,
        public PartJoin $join = PartJoin::End,
    ) {}
}
