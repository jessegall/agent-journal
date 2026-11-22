<?php

declare(strict_types=1);

namespace App\Commands\MarkTargetNotificationRead;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\NotificationUnavailable;
use App\Models\NotificationReceipt;
use App\Support\ActorIdentity;
use App\Support\NotificationReceipts;
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
            ActorIdentity::of($command->dispatchedBy()),
            fn (string $scopeId) => NotificationReceipt::findForTarget(
                $scopeId,
                $command->targetKey,
                $command->targetId,
            ),
        );

        $this->receipts->markRead($receipt, CarbonImmutable::now());
    }
}
