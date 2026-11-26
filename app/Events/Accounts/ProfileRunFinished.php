<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Profiles\Enums\ProfileRunStatus;
use App\Sessions\Contracts\ProfileRunEvent;

/**
 * A profile's script run finished in the state given.
 */
final readonly class ProfileRunFinished implements AccountEvent, ProfileRunEvent
{
    public function __construct(
        public string $runId,
        public ProfileRunStatus $status,
    ) {}
}
