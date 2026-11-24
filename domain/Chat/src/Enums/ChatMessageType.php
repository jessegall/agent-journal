<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

/**
 * What a chat message is in the chat: a message, a reaction to one, a question, or an event: something that happened.
 */
enum ChatMessageType: string
{
    case Message = 'message';
    case Reaction = 'reaction';
    case Question = 'question';
    case Event = 'event';
}
