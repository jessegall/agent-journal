<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Sharing\Support\ShareFact;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * The owner granted a share, new or from an agent's proposal; it waits for its gateway. Raised after the transaction
 * committed; a replay or a no-op raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareCreated implements Event, UserInterfaceUpdater
{
    public function __construct(public ShareFact $share) {}
}
