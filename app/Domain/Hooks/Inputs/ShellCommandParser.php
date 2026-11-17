<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

/**
 * Reads a shell line into its parsed parts and facts; the Processes domain supplies the parser.
 */
interface ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand;
}
