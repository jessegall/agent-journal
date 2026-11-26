<?php

declare(strict_types=1);

namespace App\Notifications\Commands\MarkTargetNotificationRead;

use App\Bus\Contracts\CommandHandler;
use App\Models\Notifications\NotificationReceipt;
use App\Notifications\Exceptions\NotificationUnavailable;
use App\Notifications\NotificationReceipts;
use Carbon\CarbonImmutable;

final readonly class MarkTargetNotificationReadHandler implements CommandHandler
{
    public function __construct(private NotificationReceipts $receipts) {}

    /**
     * @throws NotificationUnavailable
     */
    public function handle(MarkTargetNotificationReadCommand $command): void
    {
        $receipt = $this->receipts->ownedBy(
            $command->dispatchedBy(),
            fn (string $scopeId) => NotificationReceipt::findForTarget(
                $scopeId,
                $command->targetKey,
                $command->targetId,
            ),
        );

        $this->receipts->markRead($receipt, CarbonImmutable::now());
    }
}
