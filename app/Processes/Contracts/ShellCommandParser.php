<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Enums\ShellDialect;
use App\Values\ShellCommand;

/**
 * Reads a shell line into its parsed parts and facts; the Processes domain supplies the parser.
 */
interface ShellCommandParser
{
    /**
     * The shell line, read in the dialect, as the commands it holds.
     */
    public function parse(string $line, ShellDialect $dialect): ShellCommand;
}
