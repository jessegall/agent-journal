<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Support\ShareFact;

/**
 * An agent proposed sharing a record; the owner may approve it. Raised after the transaction committed; a replay or a
 * no-op raises
 * none.
 */
final readonly class ShareRequested implements Event
{
    public function __construct(public ShareFact $share) {}
}
