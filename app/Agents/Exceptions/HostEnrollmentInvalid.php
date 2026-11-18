<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * The host enrollment command was given input it cannot enroll a host with.
 */
final class HostEnrollmentInvalid extends RuntimeException
{
    public static function withoutName(): self
    {
        return new self('Name the host with one installation name.');
    }
}
