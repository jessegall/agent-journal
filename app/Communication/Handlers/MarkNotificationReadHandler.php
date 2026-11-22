<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\MarkNotificationRead;
use App\Communication\Exceptions\NotificationUnavailable;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Support\NotificationReceipts;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class MarkNotificationReadHandler implements CommandHandler
{
    public function __construct(private NotificationReceipts $receipts) {}

    /**
     * @throws NotificationUnavailable
     */
    public function handle(MarkNotificationRead $command): void
    {
        $receipt = $this->receipts->ownedBy(
            ActorIdentity::of($command->dispatchedBy()),
            fn (string $scopeId) => NotificationReceipt::findInScope($scopeId, $command->receiptId),
        );

        $this->receipts->markRead($receipt, CarbonImmutable::now());
    }
}
