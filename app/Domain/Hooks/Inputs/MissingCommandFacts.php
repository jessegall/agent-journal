<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

/**
 * The parser Hooks falls back to while no domain supplies one: it refuses every line by name.
 */
final readonly class MissingCommandFacts implements ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand
    {
        throw CommandFactsMissing::forLine();
    }
}
