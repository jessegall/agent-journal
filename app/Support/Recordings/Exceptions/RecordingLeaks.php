<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * A faked recording still holds a real value of the run, so it is not written.
 */
final class RecordingLeaks extends RuntimeException
{
    /**
     * @param  list<int>  $positions  each leaked value's place among the known values, never the value
     */
    public static function at(array $positions): self
    {
        $places = implode(', ', $positions);

        return new self("The faked recording still holds real values of the run, the known values at {$places}.");
    }
}
