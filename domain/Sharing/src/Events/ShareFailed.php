<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use App\Contracts\Navigation\ClientUpdate;
use Domain\Sharing\Support\ShareFact;

/**
 * A share's gateway could not open; the owner may retry before its deadline. Raised after the transaction committed; a
 * replay or a no-op raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareFailed implements ClientUpdate, ShareEvent
{
    public function __construct(public ShareFact $share) {}
}
