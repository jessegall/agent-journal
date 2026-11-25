<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Support\ActorIdentity;

/**
 * Receipts were taken from a recipient because it lost access to their targets, so what its open views show may no
 * longer be its to see. It names the recipient and nothing it saw.
 */
final readonly class NotificationsWithdrawn implements MessageEvent
{
    public function __construct(public ActorIdentity $recipient) {}
}
