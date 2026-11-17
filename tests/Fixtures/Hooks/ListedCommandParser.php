<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Core\Hooks\Inputs\CommandEffect;
use App\Core\Hooks\Inputs\CommandKind;
use App\Core\Hooks\Inputs\CommandPart;
use App\Core\Hooks\Inputs\ParseOutcome;
use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Inputs\ShellCommandParser;
use App\Core\Hooks\Inputs\ShellDialect;

/**
 * A parser for tests that knows a few lines by heart and reads every other line as unparsed.
 */
final class ListedCommandParser implements ShellCommandParser
{
    public function parse(string $line, ShellDialect $dialect): ShellCommand
    {
        $part = match ($line) {
            'composer test' => new CommandPart('composer', ['test'], CommandEffect::ChangesFiles, CommandKind::TestRun),
            'journal run tests' => new CommandPart('journal', ['run', 'tests'], CommandEffect::ReadsOnly, CommandKind::SavedCommand),
            'journal run tests --write' => new CommandPart('journal', ['run', 'tests', '--write'], CommandEffect::ChangesFiles, CommandKind::SavedCommand),
            'git status' => new CommandPart('git', ['status'], CommandEffect::ReadsOnly, CommandKind::Ordinary),
            default => null,
        };

        if ($part === null) {
            return new ShellCommand($line, $dialect, ParseOutcome::Unparsed, []);
        }

        return new ShellCommand($line, $dialect, ParseOutcome::Complete, [$part]);
    }
}
