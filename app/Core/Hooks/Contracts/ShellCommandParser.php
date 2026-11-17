<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Inputs\ShellDialect;

/**
 * Reads a shell line into its parsed parts and facts; the Processes domain supplies the parser.
 */
interface ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand;
}
