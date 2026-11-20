<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Sharing\Support\ShareFact;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The owner replaced a share's linked records at a new scope version. Raised after the transaction committed; a replay
 * or a no-op raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareScopeChanged implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(public ShareFact $share) {}
}
