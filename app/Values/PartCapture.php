<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Runs\CaptureStatus;

/**
 * The capture state one part's output was found in when it was checked against its checksums.
 */
final readonly class PartCapture
{
    public function __construct(public string $partId, public CaptureStatus $state) {}
}
