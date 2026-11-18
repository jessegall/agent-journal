<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts;

use App\Agents\Support\StackTarget;
use Domain\Chat\Api\Conversation;
use Domain\Chat\Readers\MessageRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * The conversation with one agent session, as the user acting in this request may read it.
 */
#[Bind(MessageRecords::class)]
interface ConversationReader
{
    public function conversationWith(StackTarget $target): Conversation;
}
