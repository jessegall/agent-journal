<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\MarkAllNotificationsRead;
use App\Communication\Exceptions\NotificationUnavailable;
use App\Communication\Support\NotificationReceipts;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class MarkAllNotificationsReadHandler implements CommandHandler
{
    public function __construct(private NotificationReceipts $receipts) {}

    /**
     * @throws NotificationUnavailable
     */
    public function handle(MarkAllNotificationsRead $command): bool
    {
        return $this->receipts->markAllThrough(
            ActorIdentity::of($command->dispatchedBy()),
            $command->through,
            CarbonImmutable::now(),
        );
    }
}
