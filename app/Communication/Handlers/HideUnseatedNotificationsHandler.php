<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandFacts;
use App\Communication\Commands\HideUnseatedNotifications;
use App\Communication\Events\NotificationsWithdrawn;
use App\Communication\Models\Message;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Models\NotificationScope;
use App\Communication\Resolvers\QuestionNotificationTarget;
use App\Communication\Support\NotificationReceipts;
use App\Communication\Support\NotificationScopes;
use App\Communication\Support\RegisteredInboxes;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class HideUnseatedNotificationsHandler implements CommandHandler
{
    public function __construct(
        private NotificationScopes $scopes,
        private NotificationReceipts $receipts,
        private RegisteredInboxes $inboxes,
        private CommandFacts $facts,
    ) {}

    public function handle(HideUnseatedNotifications $command): int
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
            HideUnseatedNotifications::BATCH,
        );

        $at = CarbonImmutable::now();

        foreach ($receipts as $receipt) {
            $this->receipts->hide($receipt, $at);
        }

        return count($receipts);
    }
}
