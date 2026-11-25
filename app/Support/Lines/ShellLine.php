<?php

declare(strict_types=1);

namespace App\Support\Lines;

use App\Enums\Processes\ShellDialect;

/**
 * The input of a shell analysis: the line as the agent wrote it, in its dialect.
 */
final readonly class ShellLine
{
    public function __construct(public string $line, public ShellDialect $dialect) {}
}
