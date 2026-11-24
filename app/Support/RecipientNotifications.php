<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Chat\Notifications;
use App\Data\Notifications\NotificationTarget;
use App\Enums\NotificationSourceType;
use App\Events\NotificationsWithdrawn;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use Carbon\CarbonImmutable;

/**
 * The notifications other areas send: delivery through NotificationDelivery, and a target's receipts withdrawn or
 * settled one by one through NotificationReceipts, so every change holds its scope's lock.
 */
final readonly class RecipientNotifications implements Notifications
{
    /**
     * The most receipts of one target a recipient holds: one per occurrence, and a target has few.
     */
    private const int RECEIPTS_PER_TARGET_LIMIT = 50;

    public function __construct(
        private NotificationDelivery $delivery,
        private NotificationReceipts $receipts,
        private NotificationScopes $scopes,
        private CommandFacts $facts,
    ) {}

    public function deliver(
        string $occurrenceKey,
        NotificationSourceType $source,
        NotificationTarget $target,
        array $recipients,
    ): void {
        $this->delivery->deliver($occurrenceKey, $source, $target, $recipients);
    }

    public function withdraw(NotificationTarget $target, ActorIdentity $recipient): void
    {
        $at = CarbonImmutable::now();
        $hidden = false;

        foreach ($this->receiptsOf($target, $recipient) as $receipt) {
            $hidden = $this->receipts->hide($receipt, $at) || $hidden;
        }

        if ($hidden) {
            $this->facts->publishAfterCommit(new NotificationsWithdrawn($recipient));
        }
    }

    public function settle(NotificationTarget $target, ActorIdentity $recipient): void
    {
        $at = CarbonImmutable::now();

        foreach ($this->receiptsOf($target, $recipient) as $receipt) {
            $this->receipts->markRead($receipt, $at);
        }
    }

    /**
     * @return list<NotificationReceipt>
     */
    private function receiptsOf(NotificationTarget $target, ActorIdentity $recipient): array
    {
        return NotificationScope::findFor($this->scopes->keyFor($recipient), $recipient)
            ->map(fn (NotificationScope $scope) => NotificationReceipt::allForTarget(
                $scope->id,
                $target->key,
                $target->id,
                self::RECEIPTS_PER_TARGET_LIMIT,
            ))
            ->getOrElse([]);
    }
}
