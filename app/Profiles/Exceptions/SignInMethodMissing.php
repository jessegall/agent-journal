<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Drivers\Enums\HookDriver;
use App\Hooks\Compatibility\DriverCompatibility;
use RuntimeException;

/**
 * The driver declares no such sign-in method on this host, as the build it is pinned to offers none, so the sign-in
 * is refused before any attempt starts.
 */
final class SignInMethodMissing extends RuntimeException
{
    public static function for(string $driver, string $method): self
    {
        $known = HookDriver::tryFrom($driver);
        $build = $known === null ? 'no pinned build' : 'pinned build '.DriverCompatibility::pinned($known)->version;

        return new self("{$driver} has no {$method} sign-in on this host ({$build}).");
    }

    /**
     * The refusal for a registry key written as driver:method.
     */
    public static function forKey(string $key): self
    {
        [$driver, $method] = explode(':', $key, 2) + [1 => ''];

        return self::for($driver, $method);
    }
}
