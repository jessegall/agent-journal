<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Exceptions\ShellParserMissing;

/**
 * The parser Hooks falls back to while no domain supplies one: it refuses every line by name.
 */
final readonly class MissingShellParser implements ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand
    {
        throw ShellParserMissing::forLine();
    }
}
