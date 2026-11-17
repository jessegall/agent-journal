<?php

declare(strict_types=1);

namespace App\Domain\Chat\Contracts;

use App\Core\Hooks\Support\StackTarget;
use App\Domain\Chat\Api\Conversation;
use App\Domain\Chat\Readers\MessageRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * The conversation with one agent session, as the user acting in this request may read it.
 */
#[Bind(MessageRecords::class)]
interface ConversationReader
{
    public function conversationWith(StackTarget $target): Conversation;
}
