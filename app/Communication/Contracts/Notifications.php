<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Communication\Data\NotificationTarget;
use App\Communication\Enums\NotificationSourceType;

/**
 * Notifies recipients of one committed business event, inside the caller's transaction: one occurrence per key and
 * one receipt per distinct recipient; a replay of the key changes nothing.
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
}
