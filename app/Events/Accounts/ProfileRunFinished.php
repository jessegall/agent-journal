<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Contracts\Sessions\ProfileRunEvent;
use App\Enums\Profiles\ProfileRunStatus;

/**
 * A profile's script run finished in the state given.
 */
final readonly class ProfileRunFinished implements AccountEvent, ProfileRunEvent
{
    public function __construct(
        public string $runId,
        public ProfileRunStatus $state,
    ) {}
}
