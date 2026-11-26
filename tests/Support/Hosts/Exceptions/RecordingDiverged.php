<?php

declare(strict_types=1);

namespace Tests\Support\Hosts\Exceptions;

use PHPUnit\Framework\AssertionFailedError;

/**
 * What the driver typed is not what the recording's user typed up to the checkpoint.
 */
final class RecordingDiverged extends AssertionFailedError
{
    public int $checkpoint = 0;

    public static function at(int $checkpoint): self
    {
        $diverged = new self("At checkpoint {$checkpoint} the driver typed other bytes than the recording's user.");
        $diverged->checkpoint = $checkpoint;

        return $diverged;
    }
}
