<?php

declare(strict_types=1);

namespace Tests\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * A live value cannot stand where its recording held a fake: it is empty, of another shape, or another value than the
 * one the fake is already bound to.
 */
final class LiveValueRefused extends RuntimeException
{
    public static function empty(string $place, string $recorded): self
    {
        return new self("{$place} is empty where the recording held {$recorded}.");
    }

    public static function shape(string $place, string $heard, string $recorded): self
    {
        return new self("{$place} is {$heard}, not of the shape of {$recorded}.");
    }

    public static function bound(string $place, string $heard, string $fake, string $earlier): self
    {
        return new self("{$place} is {$heard} where {$fake} is already {$earlier}.");
    }
}
