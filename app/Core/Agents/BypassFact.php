<?php

declare(strict_types=1);

namespace App\Core\Agents;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

/**
 * One hook call the host answered on its own: the native event, how the call failed, and when.
 */
final class BypassFact extends Data
{
    public function __construct(
        public readonly string $nativeEvent,
        public readonly string $failure,
        public readonly CarbonImmutable $occurredAt,
    ) {}
}
