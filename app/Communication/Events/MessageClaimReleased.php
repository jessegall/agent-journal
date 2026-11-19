<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A stalled claim on a waiting message was ended by recovery; the message waits for another member to take it up.
 */
final readonly class MessageClaimReleased implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public string $messageId) {}
}
