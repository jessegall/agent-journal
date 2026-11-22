<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Data\NotificationTarget;
use App\Enums\NotificationSourceType;
use App\Support\ActorIdentity;

/**
 * Notifies recipients of committed business events inside the caller's transaction: one occurrence per key and one
 * receipt per distinct recipient, a replay of the key changing nothing; and takes a target's receipts from a
 * recipient that lost it, or settles them as read history once the work behind them ended.
 */
interface Notifications
{
    /**
     * @param  list<ActorIdentity>  $recipients
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
    public function withdraw(NotificationTarget $target, ActorIdentity $recipient): void;

    /**
     * Marks the recipient's receipts that lead to the target read, keeping them as history with no outstanding count.
     */
    public function settle(NotificationTarget $target, ActorIdentity $recipient): void;
}
