<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * The type of answer a state gave, as the walk records it, and which hooks can take it.
 */
enum AnswerType: string
{
    case Delegate = 'delegate';
    case Allow = 'allow';
    case Deny = 'deny';
    case Rewrite = 'rewrite';

    /**
     * Whether a hook that only reports what happened can take this answer.
     */
    public function fitsEveryHook(): bool
    {
        return match ($this) {
            self::Delegate, self::Allow => true,
            self::Deny, self::Rewrite => false,
        };
    }

    /**
     * Whether a hook about to act, a prompt or a file edit, can take this answer.
     */
    public function fitsAnAction(): bool
    {
        return match ($this) {
            self::Delegate, self::Allow, self::Deny => true,
            self::Rewrite => false,
        };
    }

    public function fitsAShellCommand(): bool
    {
        return match ($this) {
            self::Delegate, self::Allow, self::Deny, self::Rewrite => true,
        };
    }

    public function fitsAStop(): bool
    {
        return match ($this) {
            self::Delegate, self::Allow, self::Deny => true,
            self::Rewrite => false,
        };
    }

    /**
     * Whether this answer takes the place of the one a walk kept so far: a denial always does, and any answer does
     * while what was kept is no denial.
     */
    public function replaces(self $kept): bool
    {
        return $this === self::Deny || $kept !== self::Deny;
    }
}
