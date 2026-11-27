<?php

declare(strict_types=1);

namespace App\Accounts\Exceptions;

use RuntimeException;

/**
 * The driver declares no such sign-in method on this host, as the build it is pinned to offers none, so the sign-in
 * is refused before any attempt starts.
 */
final class SignInMethodMissing extends RuntimeException
{
    public static function for(string $driver, string $method, string|null $pinnedBuild): self
    {
        $build = $pinnedBuild === null ? 'no pinned build' : "pinned build {$pinnedBuild}";

        return new self("{$driver} has no {$method} sign-in on this host ({$build}).");
    }
}
