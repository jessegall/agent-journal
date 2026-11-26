<?php

declare(strict_types=1);

namespace App\Accounts\Exceptions;

use App\Agents\Drivers\DefaultDrivers;
use App\Support\Compatibility\DriverCompatibility;
use RuntimeException;

/**
 * The driver declares no such sign-in method on this host, as the build it is pinned to offers none, so the sign-in
 * is refused before any attempt starts.
 */
final class SignInMethodMissing extends RuntimeException
{
    public static function for(string $driver, string $method): self
    {
        $build = in_array($driver, DefaultDrivers::familyKeys(), true)
            ? 'pinned build '.DriverCompatibility::pinned($driver)->version
            : 'no pinned build';

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
