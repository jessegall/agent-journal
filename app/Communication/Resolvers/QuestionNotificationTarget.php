<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Communication\Contracts\NotificationTargetResolver;
use App\Communication\Data\NotificationLink;
use App\Communication\Models\Message;
use App\Ui\Contracts\DeclaredPages;

/**
 * A question notification leads to the exact question in the chat, while the actor may still see the message: the
 * message's visibility scope decides, as ConversationResolver::canSee does. A question out of sight is never named.
 */
final readonly class QuestionNotificationTarget implements NotificationTargetResolver
{
    public const string KEY = 'chat.question';

    /**
     * The chat page the exact question opens on, with the message id in its question query value.
     */
    private const string CHAT_PAGE = 'chat.conversation';

    public function __construct(private DeclaredPages $pages) {}

    /**
     * The key of the one occurrence a question issues, so a replay finds it.
     */
    public static function occurrenceKey(string $messageId): string
    {
        return "question:{$messageId}";
    }

    public function linksFor(array $targetIds): array
    {
        $links = [];

        foreach (Message::query()->whereKey($targetIds)->readExactly(count($targetIds))->get() as $message) {
            $links[$message->id] = new NotificationLink(
                $message->firstLine(),
                $this->pages->addressOf(self::CHAT_PAGE, ['question' => $message->id]),
            );
        }

        return $links;
    }

    public function disclosesMissing(): bool
    {
        return false;
    }
}
