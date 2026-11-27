<?php

declare(strict_types=1);

namespace App\Notifications\Contracts;

use App\Notifications\Data\NotificationTarget;
use App\Notifications\Enums\NotificationSourceType;
use App\Support\ActorReference;

/**
 * The delivery of a notification occurrence to its recipients, once per occurrence.
 */
interface NotificationDelivery
{
    /**
     * Delivers one occurrence to each recipient once.
     *
     * @param  list<ActorReference>  $recipients
     */
    public function deliver(
        string $occurrenceKey,
        NotificationSourceType $source,
        NotificationTarget $target,
        array $recipients,
    ): void;
}
