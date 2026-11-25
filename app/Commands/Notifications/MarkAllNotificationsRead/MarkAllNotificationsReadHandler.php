<?php

declare(strict_types=1);

namespace App\Commands\Notifications\MarkAllNotificationsRead;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\NotificationUnavailable;
use App\Support\NotificationReceipts;
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
