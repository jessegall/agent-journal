<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Hooks\Support\ProgramCompatibility;
use App\Programs\Enums\HookProgram;
use RuntimeException;

/**
 * The program declares no such sign-in method on this host, as the build it is pinned to offers none, so the sign-in
 * is refused before any attempt starts.
 */
final class SignInMethodMissing extends RuntimeException
{
    public static function for(string $program, string $method): self
    {
        $known = HookProgram::tryFrom($program);
        $build = $known === null ? 'no pinned build' : 'pinned build '.ProgramCompatibility::pinned($known)->version;

        return new self("{$program} has no {$method} sign-in on this host ({$build}).");
    }

    /**
     * The refusal for a registry key written as program:method.
     */
    public static function forKey(string $key): self
    {
        [$program, $method] = explode(':', $key, 2) + [1 => ''];

        return self::for($program, $method);
    }
}
