<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\MarkQuestionNotificationRead;
use App\Communication\Exceptions\NotificationUnavailable;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Resolvers\QuestionNotificationTarget;
use App\Communication\Support\NotificationReceipts;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class MarkQuestionNotificationReadHandler implements CommandHandler
{
    public function __construct(private NotificationReceipts $receipts) {}

    /**
     * @throws NotificationUnavailable
     */
    public function handle(MarkQuestionNotificationRead $command): void
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
