<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * No build of the driver up to the one asked has a key script of that name.
 */
final class KeyScriptMissing extends RuntimeException
{
    public static function of(string $name, string $driver, string $build): self
    {
        return new self("No key script {$name} is recorded for {$driver} {$build} or an older build.");
    }
}
