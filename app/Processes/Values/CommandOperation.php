<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * The behaviour a rule selected within a program: its literal subcommand tokens, such as status for git status. Two
 * commands that differ only in operands share the operation.
 */
final readonly class CommandOperation
{
    /**
     * @param  list<string>  $subcommands
     */
    public function __construct(public ProgramIdentity $program, public array $subcommands) {}

    /**
     * The operation as one name, such as git status.
     */
    public function name(): string
    {
        return implode(' ', [$this->program->family, ...$this->subcommands]);
    }

    public function isSameOperation(self $other): bool
    {
        return $this->name() === $other->name();
    }
}
