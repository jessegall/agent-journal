<?php

declare(strict_types=1);

namespace App\Notifications\Commands\MarkAllNotificationsRead;

use App\Bus\Contracts\CommandHandler;
use App\Notifications\Exceptions\NotificationUnavailable;
use App\Notifications\NotificationReceipts;
use Carbon\CarbonImmutable;

final readonly class MarkAllNotificationsReadHandler implements CommandHandler
{
    public function __construct(private NotificationReceipts $receipts) {}

    /**
     * @throws NotificationUnavailable
     */
    public function handle(MarkAllNotificationsReadCommand $command): bool
    {
        return $this->receipts->markAllThrough(
            $command->dispatchedBy(),
            $command->through,
            CarbonImmutable::now(),
        );
    }
}
