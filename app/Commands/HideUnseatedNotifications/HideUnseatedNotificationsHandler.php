<?php

declare(strict_types=1);

namespace App\Commands\HideUnseatedNotifications;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\ActorType;
use App\Events\NotificationsWithdrawn;
use App\Models\Message;
use App\Models\NotificationReceipt;
use App\Models\NotificationScope;
use App\Resolvers\QuestionNotificationTarget;
use App\Support\ActorIdentity;
use App\Support\NotificationReceipts;
use App\Support\NotificationScopes;
use App\Support\RegisteredInboxes;
use Carbon\CarbonImmutable;

final readonly class HideUnseatedNotificationsHandler implements CommandHandler
{
    public function __construct(
        private NotificationScopes $scopes,
        private NotificationReceipts $receipts,
        private RegisteredInboxes $inboxes,
        private CommandFacts $facts,
    ) {}

    public function handle(HideUnseatedNotificationsCommand $command): int
    {
        $recipient = new ActorIdentity(ActorType::from($command->recipientType), $command->recipientId);

        $hidden = NotificationScope::findFor($this->scopes->keyFor($recipient), $recipient)
            ->map(fn (NotificationScope $scope) => $this->hideOutsideSeats($scope, $recipient))
            ->getOrElse(0);

        if ($hidden > 0) {
            $this->facts->publishAfterCommit(new NotificationsWithdrawn($recipient));
        }

        return $hidden;
    }

    private function hideOutsideSeats(NotificationScope $scope, ActorIdentity $recipient): int
    {
        $receipts = NotificationReceipt::visibleWithTargetIn(
            $scope->id,
            QuestionNotificationTarget::KEY,
            Message::idsOutsideInboxes($this->inboxes->inboxIdsOf($recipient)),
            HideUnseatedNotificationsCommand::BATCH,
        );

        $at = CarbonImmutable::now();

        foreach ($receipts as $receipt) {
            $this->receipts->hide($receipt, $at);
        }

        return count($receipts);
    }
}
