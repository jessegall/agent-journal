<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Bus\Contracts\CommandFacts;
use App\Events\Messages\NotificationsWithdrawn;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Notifications\Contracts\Notifications as NotificationsContract;
use App\Notifications\Data\NotificationTarget;
use App\Notifications\Enums\NotificationSourceType;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

/**
 * The notifications other areas send: delivery through NotificationDelivery, and a target's receipts withdrawn or
 * settled one by one through NotificationReceipts, so every change holds its scope's lock.
 */
final readonly class Notifications implements NotificationsContract
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

    public function withdraw(NotificationTarget $target, ActorReference $recipient): void
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

    public function withdrawTargets(string $targetType, Builder $ids, ActorReference $recipient, int $limit): int
    {
        $scope = NotificationScope::findFor($this->scopes->keyFor($recipient), $recipient);

        if ($scope->isEmpty()) {
            return 0;
        }

        $receipts = NotificationReceipt::findVisibleWithTargetIn($scope->get()->id, $targetType, $ids, $limit);
        $at = CarbonImmutable::now();

        foreach ($receipts as $receipt) {
            $this->receipts->hide($receipt, $at);
        }

        if ($receipts !== []) {
            $this->facts->publishAfterCommit(new NotificationsWithdrawn($recipient));
        }

        return count($receipts);
    }

    public function settle(NotificationTarget $target, ActorReference $recipient): void
    {
        $at = CarbonImmutable::now();

        foreach ($this->receiptsOf($target, $recipient) as $receipt) {
            $this->receipts->markRead($receipt, $at);
        }
    }

    /**
     * @return list<NotificationReceipt>
     */
    private function receiptsOf(NotificationTarget $target, ActorReference $recipient): array
    {
        return NotificationScope::findFor($this->scopes->keyFor($recipient), $recipient)
            ->map(fn (NotificationScope $scope) => NotificationReceipt::findAllForTarget(
                $scope->id,
                $target->key,
                $target->id,
                self::RECEIPTS_PER_TARGET_LIMIT,
            ))
            ->getOrElse([]);
    }
}
