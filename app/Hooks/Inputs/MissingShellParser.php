<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Enums\ShellDialect;
use App\Hooks\Exceptions\ShellParserMissing;
use App\Processes\Values\ShellCommand;

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
