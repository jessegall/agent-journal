<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A step of a proven path the host sent that the library will not keep: it could carry screen text, or it is not a
 * step at all.
 */
final class MenuStepRefused extends RuntimeException implements CommandRefusal
{
    public static function tooMany(int $steps, int $most): self
    {
        return new self("A proven path of {$steps} steps is longer than the {$most} a menu entry keeps.");
    }

    public static function fingerprintMalformed(int $step): self
    {
        return new self("Step {$step} names no fingerprint of the form fp1: and 64 hexadecimal characters.");
    }

    public static function notOneAction(int $step): self
    {
        return new self("Step {$step} must choose a label or press a key, exactly one of them.");
    }

    public static function keyNotAllowed(int $step, string $key): self
    {
        return new self("Step {$step} presses {$key}, which is no named key.");
    }

    public static function textTooLong(int $step, int $most): self
    {
        return new self("A label or proof of step {$step} is longer than {$most} characters.");
    }

    public static function unexpectedField(int $step, string $field): self
    {
        return new self("Step {$step} holds {$field}; a step holds only fingerprint, choose, key and proof.");
    }
}
