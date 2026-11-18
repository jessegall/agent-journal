<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Enums\ShellDialect;
use App\Processes\Values\ShellCommand;

/**
 * Reads a shell line into its parsed parts and facts; the Processes domain supplies the parser.
 */
interface ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand;
}
