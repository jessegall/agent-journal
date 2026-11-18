<?php

declare(strict_types=1);

namespace App\Processes\Values\Lines;

use App\Processes\Enums\ShellDialect;

/**
 * The input of a shell analysis: the line as the agent wrote it, in its dialect.
 */
final readonly class ShellLine
{
    public function __construct(public string $line, public ShellDialect $dialect) {}
}
