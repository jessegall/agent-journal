<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Enums\Reviews\RepairRequestState;

/**
 * A repair request was settled in the state given.
 */
final readonly class RepairRequestSettled extends ReviewEvent
{
    public function __construct(
        public string $requestId,
        public RepairRequestState $state,
    ) {}
}
