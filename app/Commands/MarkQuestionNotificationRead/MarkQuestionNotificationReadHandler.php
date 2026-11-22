<?php

declare(strict_types=1);

namespace App\Commands\MarkQuestionNotificationRead;

use App\Contracts\CommandHandler;
use App\Exceptions\NotificationUnavailable;
use App\Models\NotificationReceipt;
use App\Resolvers\QuestionNotificationTarget;
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
                QuestionNotificationTarget::occurrenceKey($command->messageId),
            ),
        );

        $this->receipts->markRead($receipt, CarbonImmutable::now());
    }
}
