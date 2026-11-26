<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\HideLeftInboxNotifications;

use App\Notifications\Contracts\Notifications;
use App\Support\ActorReference;
use Domain\Questions\Commands\Support\QuestionCommandHandler;
use Domain\Questions\Models\Question;
use Domain\Questions\Values\QuestionNotificationKeys;

final readonly class HideLeftInboxNotificationsHandler extends QuestionCommandHandler
{
    public function __construct(private Notifications $notifications) {}

    public function handle(HideLeftInboxNotificationsCommand $command): int
    {
        $recipient = ActorReference::fromStored($command->recipientType, $command->recipientId);

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
