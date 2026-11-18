<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\ShellCommandParser;
use App\Hooks\Enums\CommandEffect;
use App\Hooks\Enums\CommandType;
use App\Hooks\Enums\ParseOutcome;
use App\Hooks\Enums\ShellDialect;
use App\Hooks\Inputs\CommandPart;
use App\Hooks\Inputs\ShellCommand;

/**
 * A parser for tests that knows a few lines by heart and reads every other line as unparsed.
 */
final class ListedCommandParser implements ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand
    {
        $part = match ($line) {
            'composer test' => new CommandPart('composer', ['test'], CommandEffect::ChangesFiles, CommandType::TestRun),
            'journal run tests' => new CommandPart('journal', ['run', 'tests'], CommandEffect::ReadsOnly, CommandType::Alias),
            'journal run tests --write' => new CommandPart('journal', ['run', 'tests', '--write'], CommandEffect::ChangesFiles, CommandType::Alias),
            'git status' => new CommandPart('git', ['status'], CommandEffect::ReadsOnly, CommandType::Ordinary),
            default => null,
        };

        if ($part === null) {
            return new ShellCommand($line, $dialect, ParseOutcome::Unparsed, []);
        }

        return new ShellCommand($line, $dialect, ParseOutcome::Complete, [$part]);
    }
}
