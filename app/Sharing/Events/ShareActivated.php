<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Sharing\Support\ShareFact;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A share's gateway opened, so the share is readable. Raised after the transaction committed; a replay or a no-op raises
 * none.
 */
final readonly class ShareActivated implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public ShareFact $share) {}
}
