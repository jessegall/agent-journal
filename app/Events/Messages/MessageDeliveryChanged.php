<?php

declare(strict_types=1);

namespace App\Events\Messages;

/**
 * A message's delivery moved: it arrived in its agent's session, its delivery failed, or a retry queued it again.
 */
final readonly class MessageDeliveryChanged implements MessageEvent
{
    public function __construct(
        public string $messageId,
        public string $inboxId,
    ) {}
}
