<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\HideLeftInboxNotifications;

use App\Contracts\Notifications\Notifications;
use App\Support\ActorIdentity;
use Domain\Questions\Commands\Support\QuestionCommandHandler;
use Domain\Questions\Models\Question;
use Domain\Questions\Values\QuestionNotificationKeys;

final readonly class HideLeftInboxNotificationsHandler extends QuestionCommandHandler
{
    public function __construct(private Notifications $notifications) {}

    public function handle(HideLeftInboxNotificationsCommand $command): int
    {
        $recipient = ActorIdentity::fromStored($command->recipientType, $command->recipientId);
        $questions = Question::query()->ofInbox($command->inboxId)->withTargetType($recipient->type)
            ->ofTarget($recipient->id)->keys();

        return $this->notifications->withdrawTargets(
            QuestionNotificationKeys::target(),
            $questions,
            $recipient,
            HideLeftInboxNotificationsCommand::BATCH,
        );
    }
}
