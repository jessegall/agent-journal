<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use Domain\Sharing\Support\ShareFact;

/**
 * A share or a proposal reached its deadline. Raised after the transaction committed; a replay or a no-op raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareExpired extends ShareEvent implements UserInterfaceUpdater
{
    public function __construct(public ShareFact $share) {}
}
