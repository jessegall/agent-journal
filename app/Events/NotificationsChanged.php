<?php

declare(strict_types=1);

namespace App\Events;

/**
 * The receipts or the unread count of one notification scope changed; it names the scope and nothing it shows.
 */
final readonly class NotificationsChanged extends MessageEvent
{
    public function __construct(
        public string $scopeId,
    ) {}
}
