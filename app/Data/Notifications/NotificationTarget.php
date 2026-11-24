<?php

declare(strict_types=1);

namespace App\Data\Notifications;

/**
 * The work a notification opens: a destination key, such as chat.question, and the id of the row it names.
 */
final readonly class NotificationTarget
{
    public function __construct(
        public string $key,
        public string $id,
    ) {}
}
