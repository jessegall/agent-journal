<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Navigation\Contracts\ClientUpdate;
use App\Sharing\Support\ShareFact;

/**
 * The owner granted a share, new or from an agent's proposal; it waits for its gateway. Raised after the transaction
 * committed; a replay or a no-op raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareCreated implements ClientUpdate, ShareEvent
{
    public function __construct(public ShareFact $share) {}
}
