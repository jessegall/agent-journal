<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Contracts\Navigation\DeclaredPages;
use App\Contracts\Notifications\NotificationTargetResolver;
use App\Data\Notifications\NotificationLink;
use Domain\Questions\Contracts\QuestionSummaryReader;

/**
 * A question's notification opens the chat of the inbox it was asked in, where its card waits for the answer.
 */
final readonly class QuestionNotificationTarget implements NotificationTargetResolver
{
    private const string CHAT_PAGE = 'chat.conversation';

    public function __construct(private DeclaredPages $pages, private QuestionSummaryReader $questions) {}

    public function linksFor(array $ids): array
    {
        $links = [];

        foreach ($this->questions->byIds($ids) as $question) {
            $links[$question->id] = new NotificationLink(
                $question->firstLine,
                $this->pages->addressOf(self::CHAT_PAGE, ['inbox' => $question->inboxId]),
            );
        }

        return $links;
    }

    public function disclosesMissing(): bool
    {
        return false;
    }
}
