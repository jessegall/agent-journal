<?php

declare(strict_types=1);

namespace App\Notifications\Contracts;

use App\Notifications\Data\NotificationTarget;
use App\Notifications\Enums\NotificationSourceType;
use App\Support\ActorReference;
use Illuminate\Database\Eloquent\Builder;

/**
 * Notifies recipients of committed business events inside the caller's transaction: one occurrence per key and one
 * receipt per distinct recipient, a replay of the key changing nothing; and takes a target's receipts from a
 * recipient that lost it, or settles them as read history once the work behind them ended.
 */
interface Notifications
{
    /**
     * @param  list<ActorReference>  $recipients
     */
    public function deliver(
        string $occurrenceKey,
        NotificationSourceType $source,
        NotificationTarget $target,
        array $recipients,
    ): void;

    /**
     * Hides the recipient's receipts that lead to the target, so they leave its list and count, and tells its open
     * views to drop what they show.
     */
    public function withdraw(NotificationTarget $target, ActorReference $recipient): void;

    /**
     * Hides up to the limit of the recipient's visible receipts of one target type whose target id the query lists,
     * tells its open views when any went, and gives how many it hid.
     *
     * @param  Builder<*>  $ids
     */
    public function withdrawTargets(string $targetType, Builder $ids, ActorReference $recipient, int $limit): int;

    /**
     * Marks the recipient's receipts that lead to the target read, keeping them as history with no outstanding count.
     */
    public function settle(NotificationTarget $target, ActorReference $recipient): void;
}
