<?php

declare(strict_types=1);

namespace App\Events\Messages;

/**
 * The receipts or the unread count of one notification scope changed; it names the scope and nothing it shows.
 */
final readonly class NotificationsChanged implements MessageEvent
{
    public function __construct(
        public string $scopeId,
    ) {}
}
