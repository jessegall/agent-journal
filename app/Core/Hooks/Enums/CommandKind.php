<?php

declare(strict_types=1);

namespace App\Core\Hooks\Enums;

/**
 * What a command part is, as the parser knows it: a test run or a build must run as a saved command.
 */
enum CommandKind: string
{
    case Ordinary = 'ordinary';
    case TestRun = 'test_run';
    case Build = 'build';
    case SavedCommand = 'saved_command';
    case Unknown = 'unknown';

    public function needsSavedCommand(): bool
    {
        return match ($this) {
            self::TestRun, self::Build, self::Unknown => true,
            self::Ordinary, self::SavedCommand => false,
        };
    }
}
