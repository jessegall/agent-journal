<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Sharing\Support\ShareFact;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A share's gateway could not open; the owner may retry before its deadline. Raised after the transaction committed; a replay or a no-op raises
 * none.
 */
final readonly class ShareFailed implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public ShareFact $share) {}
}
