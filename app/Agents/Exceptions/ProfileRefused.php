<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A profile cannot make a start safe: an unresolved path, account settings that would undo the profile, or an
 * argument that would.
 */
final class ProfileRefused extends RuntimeException implements CommandRefusal
{
    /**
     * A driver start with no model or no effort, which would run at the driver's own default.
     */
    public static function withoutModelOrEffort(string $driver): self
    {
        return new self("A {$driver} start names no model or no effort, so it would run at the driver's own default.");
    }

    public static function unresolvedSetting(string $what): self
    {
        return new self("the start has an unresolved setting: {$what}");
    }

    public static function settingReplaced(string $path): self
    {
        return new self("the account's protection setting {$path} would replace the start's own");
    }

    public static function asksUser(): self
    {
        return new self("the account start's settings would make the driver ask a user: it is not started");
    }

    /**
     * A driver that cannot run on its owner's own terminal yet, as the build pinned gives its hooks no session of
     * their own there.
     */
    public static function ownTerminalWithheld(string $driver): self
    {
        return new self("{$driver} does not start on its owner's terminal yet: its pinned build gives a hook call no session of its own");
    }
}
