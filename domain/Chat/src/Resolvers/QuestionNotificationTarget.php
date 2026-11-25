<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Navigation\DeclaredPages;
use App\Contracts\Notifications\NotificationTargetResolver;
use App\Data\Notifications\NotificationLink;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorReference;
use Domain\Questions\Contracts\QuestionSummaryReader;
use Domain\Questions\Values\QuestionSummary;

/**
 * A question's notification opens the chat of the inbox it was asked in, where its card waits for the answer.
 */
final readonly class QuestionNotificationTarget implements NotificationTargetResolver
{
    private const string CHAT_PAGE = 'chat.conversation';

    public function __construct(
        private DeclaredPages $pages,
        private QuestionSummaryReader $questions,
        private CurrentActor $actors,
    ) {}

    /**
     * Links only the questions of inboxes the reader is attached to; any other reads as missing.
     */
    public function linksFor(array $ids): array
    {
        $questions = $this->questions->byIds($ids);

        $inboxIds = array_values(
            array_unique(array_map(fn (QuestionSummary $question) => $question->inboxId, $questions)),
        );

        $attached = InboxMember::query()
            ->active()
            ->ofActor(ActorReference::of($this->actors->actor()))
            ->ofInboxes($inboxIds)
            ->pluck('inbox_id')
            ->all();

        $links = [];

        foreach ($questions as $question) {
            if (! in_array($question->inboxId, $attached, true)) {
                continue;
            }

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
