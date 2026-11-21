<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\RecordPolicy;
use App\Operations\Enums\AccessType;
use Domain\Chat\Models\Conversation;
use Illuminate\Auth\Access\Response;

/**
 * Docking in a conversation and undocking from it, for an actor holding the grant; the handler then refuses an actor
 * whose own inbox is not one side of the conversation.
 */
final readonly class ConversationPolicy implements RecordPolicy
{
    public static function model(): string
    {
        return Conversation::class;
    }

    public function permits(Actor $actor, Conversation $conversation, AccessType $access): Response
    {
        return $access === AccessType::Edit ? Response::allow() : Response::deny();
    }
}
