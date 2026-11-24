<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\ProfileRunEvent;
use App\Enums\ProfileRunState;

/**
 * A profile's script run finished in the state given.
 */
final readonly class ProfileRunFinished extends AccountEvent implements ProfileRunEvent
{
    public function __construct(
        public string $runId,
        public ProfileRunState $state,
    ) {}
}
