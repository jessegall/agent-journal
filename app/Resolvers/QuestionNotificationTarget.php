<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\DeclaredPages;
use App\Contracts\NotificationTargetResolver;
use App\Data\NotificationLink;
use App\Models\Message;

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

    public function linksFor(array $ids): array
    {
        $links = [];

        foreach (Message::query()->whereKey($ids)->readExactly(count($ids))->get() as $message) {
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
