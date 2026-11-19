<?php

declare(strict_types=1);

namespace App\Sharing\Events;

use App\Contracts\Event;
use App\Sharing\Support\ShareFact;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A share's gateway could not open; the owner may retry before its deadline. Raised after the transaction committed; a
 * replay or a no-op raises
 * none. The owner's open sharing pages reread on it.
 */
final readonly class ShareFailed implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public ShareFact $share) {}
}
