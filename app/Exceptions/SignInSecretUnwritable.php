<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use SensitiveParameter;
use Throwable;

/**
 * The account folder already holds a key or token file, or cannot take one, so the given value is not kept; the
 * message names the folder only, never the value.
 */
final class SignInSecretUnwritable extends RuntimeException
{
    public static function in(#[SensitiveParameter] string $directory, Throwable|null $cause = null): self
    {
        $folder = basename($directory);

        return new self("The account folder {$folder} could not take a new key or token file.", previous: $cause);
    }
}
