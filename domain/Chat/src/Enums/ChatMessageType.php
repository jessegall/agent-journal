<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

/**
 * What a chat message is in the chat: a message, a reaction to one, or a mark of something that happened.
 */
enum ChatMessageType: string
{
    case Message = 'message';
    case Reaction = 'reaction';
    case Mark = 'mark';
}
