<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ShareFact;

/**
 * A share or a proposal reached its deadline. Raised after the transaction committed; a replay or a no-op raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareExpired extends ShareEvent implements UserInterfaceUpdater
{
    public function __construct(public ShareFact $share) {}
}
