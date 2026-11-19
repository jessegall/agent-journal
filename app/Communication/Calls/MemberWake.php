<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use Spatie\LaravelData\Data;

/**
 * Whether one notified member's runtime accepted the wake, and its request when it did.
 */
final class MemberWake extends Data
{
    public function __construct(
        public string $actorType,
        public string $actorId,
        public string|null $requestId,
    ) {}
}
