<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

use App\Commands\Messages\PostChatMessage\PostChatMessageCommand;
use App\Commands\Messages\ReplyInChat\ReplyInChatCommand;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The chat write a request key was used for: a send between two inboxes or a reply to a message.
 */
#[TypeScript]
enum SentOperation: string
{
    case Send = 'send';
    case Reply = 'reply';

    /**
     * @return class-string
     */
    public function command(): string
    {
        return match ($this) {
            self::Send => PostChatMessageCommand::class,
            self::Reply => ReplyInChatCommand::class,
        };
    }
}
