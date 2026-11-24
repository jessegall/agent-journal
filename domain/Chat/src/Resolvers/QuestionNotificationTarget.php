<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Contracts\Notifications\NotificationTargetResolver;
use App\Contracts\Navigation\DeclaredPages;
use App\Data\Notifications\NotificationLink;
use App\Models\Questions\Question;

/**
 * A question's notification opens the chat of the inbox it was asked in, where its card waits for the answer.
 */
final readonly class QuestionNotificationTarget implements NotificationTargetResolver
{
    private const string CHAT_PAGE = 'chat.conversation';

    public function __construct(private DeclaredPages $pages) {}

    public function linksFor(array $ids): array
    {
        $links = [];

        foreach (Question::query()->whereKey($ids)->limit(count($ids))->get() as $question) {
            $links[$question->id] = new NotificationLink(
                strtok($question->text, "\n") ?: $question->text,
                $this->pages->addressOf(self::CHAT_PAGE, ['inbox' => $question->inbox_id]),
            );
        }

        return $links;
    }

    public function disclosesMissing(): bool
    {
        return false;
    }
}
