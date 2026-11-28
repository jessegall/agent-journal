<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * A recording run could not be written, so the earlier recording of its scenario stays.
 */
final class RecordingUnfinished extends RuntimeException
{
    public static function runStillOpen(string $scenario): self
    {
        return new self("The recording run of {$scenario} is still open: close it before it is finished.");
    }

    public static function framesUnrendered(string $error): self
    {
        return new self('The frames of the recorded terminals could not be rendered: '.trim($error));
    }
}
