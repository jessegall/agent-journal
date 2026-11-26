<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use App\Navigation\Contracts\ClientUpdate;
use Domain\Sharing\Support\ShareFact;

/**
 * A share's gateway opened, so the share is readable. Raised after the transaction committed; a replay or a no-op
 * raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareActivated implements ClientUpdate, ShareEvent
{
    public function __construct(public ShareFact $share) {}
}
