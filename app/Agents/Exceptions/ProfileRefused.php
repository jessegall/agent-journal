<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A profile cannot make a start safe: an unresolved path, account settings that would undo the profile, or an
 * argument that would.
 */
final class ProfileRefused extends RuntimeException
{
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

    public static function toolsOutsideSandbox(): self
    {
        return new self("the account start's settings do not keep every tool in the sandbox: it is not started");
    }

    /**
     * A driver whose sandbox does not keep its tools from its sign-in is refused on a protected account, whose
     * container would hand them that sign-in.
     */
    public static function notContainable(string $driver): self
    {
        return new self("{$driver}'s sandbox does not keep its tools from its sign-in: it is not started in a container");
    }
}
