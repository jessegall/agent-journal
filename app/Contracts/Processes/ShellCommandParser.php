<?php

declare(strict_types=1);

namespace App\Contracts\Processes;

use App\Enums\ShellDialect;
use App\Values\ShellCommand;

/**
 * Reads a shell line into its parsed parts and facts; the Processes domain supplies the parser.
 */
interface ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand;
}
