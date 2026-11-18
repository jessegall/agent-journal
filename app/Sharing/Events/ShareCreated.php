<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Sharing\Support\ShareFact;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The owner granted a share, new or from an agent's proposal; it waits for its gateway. Raised after the transaction committed; a replay or a no-op raises
 * none.
 */
final readonly class ShareCreated implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public ShareFact $share) {}
}
