<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Enums\ShellDialect;
use App\Hooks\Inputs\ShellCommand;

/**
 * Reads a shell line into its parsed parts and facts; the Processes domain supplies the parser.
 */
interface ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand;
}
