<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Sharing\Support\ShareFact;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A share or a proposal reached its deadline. Raised after the transaction committed; a replay or a no-op raises
 * none.
 */
final readonly class ShareExpired implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public ShareFact $share) {}
}
