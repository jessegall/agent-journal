<?php

declare(strict_types=1);

namespace App\Commands\Notifications\HideLeftInboxNotifications;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Messages\NotificationsWithdrawn;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Models\Questions\Question;
use App\Support\ActorIdentity;
use App\Support\NotificationReceipts;
use App\Support\NotificationScopes;
use App\Support\QuestionNotificationKeys;
use Carbon\CarbonImmutable;

final readonly class HideLeftInboxNotificationsHandler implements CommandHandler
{
    public function __construct(
        private NotificationScopes $scopes,
        private NotificationReceipts $receipts,
        private CommandFacts $facts,
    ) {}

    public function handle(HideLeftInboxNotificationsCommand $command): int
    {
        $recipient = ActorIdentity::fromStored($command->recipientType, $command->recipientId);

        $hidden = NotificationScope::findFor($this->scopes->keyFor($recipient), $recipient)
            ->map(fn (NotificationScope $scope) => $this->hideOfInbox($scope, $recipient, $command->inboxId))
            ->getOrElse(0);

        if ($hidden > 0) {
            $this->facts->publishAfterCommit(new NotificationsWithdrawn($recipient));
        }

        return $hidden;
    }

    private function hideOfInbox(NotificationScope $scope, ActorIdentity $recipient, string $inboxId): int
    {
        $receipts = NotificationReceipt::visibleWithTargetIn(
            $scope->id,
            QuestionNotificationKeys::target(),
            Question::query()->ofInbox($inboxId)->withTargetType($recipient->type)
                ->ofTarget($recipient->id)->keys(),
            HideLeftInboxNotificationsCommand::BATCH,
        );

        $at = CarbonImmutable::now();

        foreach ($receipts as $receipt) {
            $this->receipts->hide($receipt, $at);
        }

        return count($receipts);
    }
}
