<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Data\Notifications\NotificationTarget;
use App\Enums\Notifications\NotificationSourceType;
use App\Models\Notifications\NotificationReceipt;
use App\Support\ActorIdentity;
use App\Support\NotificationDelivery;

/**
 * Notifications of questions delivered to one actor through the real delivery, for the tests of reading them.
 */
trait DeliversNotifications
{
    /**
     * The receipts of one notification each for the questions numbered first to last.
     *
     * @return list<NotificationReceipt>
     */
    private function notify(ActorIdentity $recipient, int $first, int $last): array
    {
        for ($number = $first; $number <= $last; $number++) {
            $this->app->make(NotificationDelivery::class)->deliver(
                "question:{$number}",
                NotificationSourceType::Question,
                new NotificationTarget('chat.question', (string) $number),
                [$recipient],
            );
        }

        return array_values(NotificationReceipt::query()->orderBy('sequence')->get()->all());
    }
}
