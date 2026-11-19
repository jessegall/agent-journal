<?php

declare(strict_types=1);

namespace App\Processes\Values;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * The facts a kept process event stores: the part it moved, and whichever of the pid, the end, its code, the result
 * that skipped the part or the reason its type carries. A fact the event does not carry is left out.
 */
final class ProcessEventPayload extends Data
{
    public function __construct(
        public readonly string|Optional $part = new Optional(),
        public readonly int|Optional $pid = new Optional(),
        public readonly string|Optional $end = new Optional(),
        public readonly int|Optional $code = new Optional(),
        public readonly string|Optional $because = new Optional(),
        public readonly string|Optional $reason = new Optional(),
    ) {}
}
