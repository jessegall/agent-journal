<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

/**
 * A shell line as the agent wrote it, with the commands the Processes parser found in it.
 */
final readonly class ShellCommand
{
    /**
     * @param  list<string>  $commands  each command of the line, as the parser split it
     */
    public function __construct(
        public string $line,
        public array $commands,
    ) {}
}
