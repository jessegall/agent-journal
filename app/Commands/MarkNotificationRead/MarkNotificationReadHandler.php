<?php

declare(strict_types=1);

namespace App\Commands\MarkNotificationRead;

use App\Contracts\CommandHandler;
use App\Exceptions\NotificationUnavailable;
use App\Models\NotificationReceipt;
use App\Support\ActorIdentity;
use App\Support\NotificationReceipts;
use Carbon\CarbonImmutable;

final readonly class MarkNotificationReadHandler implements CommandHandler
{
    public function __construct(private NotificationReceipts $receipts) {}

    /**
     * @throws NotificationUnavailable
     */
    public function handle(MarkNotificationReadCommand $command): void
    {
        $receipt = $this->receipts->ownedBy(
            ActorIdentity::of($command->dispatchedBy()),
            fn (string $scopeId) => NotificationReceipt::findInScope($scopeId, $command->receiptId),
        );

        $this->receipts->markRead($receipt, CarbonImmutable::now());
    }
}
