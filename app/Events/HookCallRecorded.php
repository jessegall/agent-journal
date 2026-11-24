<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A hook call's answer and steps were recorded.
 */
final readonly class HookCallRecorded extends HookEvent
{
    public function __construct(
        public string $callId,
    ) {}
}
