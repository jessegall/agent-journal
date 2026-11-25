<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

use App\Contracts\Navigation\ClientUpdate;
use Domain\Sharing\Support\ShareFact;

/**
 * The owner replaced a share's linked records at a new scope version. Raised after the transaction committed; a replay
 * or a no-op raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareScopeChanged extends ShareEvent implements ClientUpdate
{
    public function __construct(public ShareFact $share) {}
}
