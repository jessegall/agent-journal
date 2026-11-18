<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * What a command part is, as the parser knows it: a test run or a build must run through a command alias.
 */
enum CommandType: string
{
    case Ordinary = 'ordinary';
    case TestRun = 'test_run';
    case Build = 'build';
    case Alias = 'alias';
    case Unknown = 'unknown';

    public function needsAlias(): bool
    {
        return match ($this) {
            self::TestRun, self::Build, self::Unknown => true,
            self::Ordinary, self::Alias => false,
        };
    }
}
