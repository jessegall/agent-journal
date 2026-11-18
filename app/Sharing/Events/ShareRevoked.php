<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Sharing\Support\ShareFact;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The owner revoked a share or dismissed a proposal. Raised after the transaction committed; a replay or a no-op raises
 * none.
 */
final readonly class ShareRevoked implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public ShareFact $share) {}
}
