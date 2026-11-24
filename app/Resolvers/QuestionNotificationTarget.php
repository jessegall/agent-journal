<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Chat\NotificationTargetResolver;
use App\Contracts\Navigation\DeclaredPages;
use App\Data\Notifications\NotificationLink;
use App\Models\Questions\Question;

/**
 * The notification of a question, linked to the page that opens it; only its target is notified.
 */
final readonly class QuestionNotificationTarget implements NotificationTargetResolver
{
    public const string KEY = 'core.question';

    /**
     * The page the exact question opens on, with the question's id in its question query value.
     */
    private const string CHAT_PAGE = 'chat.conversation';

    public function __construct(private DeclaredPages $pages) {}

    /**
     * The key of the one occurrence a question issues, so a replay finds it.
     */
    public static function occurrenceKey(string $questionId): string
    {
        return "question:{$questionId}";
    }

    public function linksFor(array $ids): array
    {
        $links = [];

        foreach (Question::query()->whereKey($ids)->limit(count($ids))->get() as $question) {
            $links[$question->id] = new NotificationLink(
                strtok($question->text, "\n") ?: $question->text,
                $this->pages->addressOf(self::CHAT_PAGE, ['question' => $question->id]),
            );
        }

        return $links;
    }

    public function disclosesMissing(): bool
    {
        return false;
    }
}
