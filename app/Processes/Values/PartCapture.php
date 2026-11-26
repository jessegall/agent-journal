<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\CaptureStatus;

/**
 * The capture state one part's output was found in when it was checked against its checksums.
 */
final readonly class PartCapture
{
    public function __construct(public string $partId, public CaptureStatus $status) {}
}
