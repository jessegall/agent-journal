<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * The sign-in runner cannot take its host secret: the secret file is missing, empty or open to others, or both ways
 * of giving it are set. The message names the variables, never the file's content.
 */
final class HostSecretUnreadable extends RuntimeException
{
    public static function missing(): self
    {
        return new self('JOURNAL_HOST_SECRET_FILE names a file that is not there.');
    }

    public static function empty(): self
    {
        return new self('JOURNAL_HOST_SECRET_FILE names an empty file.');
    }

    public static function tooOpen(): self
    {
        return new self('JOURNAL_HOST_SECRET_FILE names a file its group or others can read: make it mode 0600.');
    }

    public static function givenTwice(): self
    {
        return new self('Set JOURNAL_HOST_SECRET_FILE or JOURNAL_HOST_SECRET, not both.');
    }
}
