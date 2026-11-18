<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Enums\ShellDialect;
use App\Processes\Values\ShellTree;

/**
 * Reads a shell line as a lossless syntax tree in the given dialect, within the fixed analysis limits; nothing runs.
 */
interface ShellSyntax
{
    public function parse(string $line, ShellDialect $dialect): ShellTree;
}
