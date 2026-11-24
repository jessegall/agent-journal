<?php

declare(strict_types=1);

namespace App\Commands\Notifications\MarkQuestionNotificationRead;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\NotificationUnavailable;
use App\Models\Notifications\NotificationReceipt;
use App\Support\QuestionNotificationKeys;
use App\Support\ActorIdentity;
use App\Support\NotificationReceipts;
use Carbon\CarbonImmutable;

final readonly class MarkQuestionNotificationReadHandler implements CommandHandler
{
    public function __construct(private NotificationReceipts $receipts) {}

    /**
     * @throws NotificationUnavailable
     */
    public function handle(MarkQuestionNotificationReadCommand $command): void
    {
        $receipt = $this->receipts->ownedBy(
            ActorIdentity::of($command->dispatchedBy()),
            fn (string $scopeId) => NotificationReceipt::findForOccurrence(
                $scopeId,
                QuestionNotificationKeys::occurrenceKey($command->messageId),
            ),
        );

        $this->receipts->markRead($receipt, CarbonImmutable::now());
    }
}
