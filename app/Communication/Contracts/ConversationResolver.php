<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Agents\Support\StackTarget;
use App\Communication\Data\Conversation;
use App\Communication\Resolvers\MessageRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * The conversation with one agent session, as the user acting in this request may read it.
 */
#[Bind(MessageRecords::class)]
interface ConversationResolver
{
    public function conversationWith(StackTarget $target): Conversation;
}
