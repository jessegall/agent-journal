<?php

declare(strict_types=1);

namespace App\Events\Hooks;

/**
 * A hook call's answer and steps were recorded.
 */
final readonly class HookCallRecorded implements HookEvent
{
    public function __construct(
        public string $callId,
    ) {}
}
