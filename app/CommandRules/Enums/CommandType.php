<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

/**
 * What a command part is, as the parser knows it: a test run or a build must run through a command alias.
 */
enum CommandType: string
{
    case Ordinary = 'ordinary';
    case Verification = 'verification';
    case Build = 'build';
    case Alias = 'alias';
    case Unknown = 'unknown';

    /**
     * The purpose as a user reads it; verification is shown as Tests and checks.
     */
    public function label(): string
    {
        return match ($this) {
            self::Ordinary => 'Ordinary',
            self::Verification => 'Tests and checks',
            self::Build => 'Build',
            self::Alias => 'Alias',
            self::Unknown => 'Unknown',
        };
    }

    /**
     * How much output a part of this purpose must keep: tests, checks and builds keep it whole.
     */
    public function outputRequirement(): OutputRequirement
    {
        if ($this === self::Verification
            || $this === self::Build) {
            return OutputRequirement::Full;
        }

        return OutputRequirement::Ordinary;
    }

    public function needsAlias(): bool
    {
        return match ($this) {
            self::Verification, self::Build, self::Unknown => true,
            self::Ordinary, self::Alias => false,
        };
    }
}
