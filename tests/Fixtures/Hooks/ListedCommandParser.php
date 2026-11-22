<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Contracts\Processes\ShellCommandParser;
use App\Enums\CommandEffect;
use App\Enums\CommandType;
use App\Enums\ParseOutcome;
use App\Enums\ShellDialect;
use App\Values\CommandPart;
use App\Values\ShellCommand;

/**
 * A parser for tests that knows a few lines by heart and reads every other line as unparsed.
 */
final class ListedCommandParser implements ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand
    {
        return match ($line) {
            'composer test' => self::known($line, $dialect, new CommandPart(
                'composer',
                ['test'],
                CommandEffect::ChangesFiles,
                CommandType::Verification,
            )),
            'journal run tests' => self::known($line, $dialect, new CommandPart(
                'journal',
                ['run', 'tests'],
                CommandEffect::ReadsOnly,
                CommandType::Alias,
            )),
            'journal run tests --write' => self::known($line, $dialect, new CommandPart(
                'journal',
                ['run', 'tests', '--write'],
                CommandEffect::ChangesFiles,
                CommandType::Alias,
            )),
            'git status' => self::known(
                $line,
                $dialect,
                new CommandPart('git', ['status'], CommandEffect::ReadsOnly, CommandType::Ordinary),
            ),
            default => new ShellCommand($line, $dialect, ParseOutcome::Unparsed, []),
        };
    }

    private static function known(string $line, ShellDialect $dialect, CommandPart $part): ShellCommand
    {
        return new ShellCommand($line, $dialect, ParseOutcome::Complete, [$part]);
    }
}
