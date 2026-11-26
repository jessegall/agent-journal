<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Navigation\Contracts\ClientUpdate;
use App\Sharing\Support\ShareFact;

/**
 * The owner revoked a share or dismissed a proposal. Raised after the transaction committed; a replay or a no-op raises
 * none. The owner's open sharing pages reread on it, and every open page drops what the share may have shown first.
 */
final readonly class ShareRevoked implements ClientUpdate, ShareEvent
{
    public function __construct(public ShareFact $share) {}
}
