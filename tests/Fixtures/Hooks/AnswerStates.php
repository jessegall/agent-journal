<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Events\Messages\ChatMessageOffered;
use App\Support\States\AnswerMessageState;
use App\Values\AnswerBudget;
use Tests\Support\TestActors;

/**
 * Answering states of agent 2 in chat 1 for stack tests: one that holds the agent to answer a message at once, and one
 * with nothing left to answer.
 */
final class AnswerStates
{
    public const string CHAT = 'chat-1';

    public static function holding(string $messageId): AnswerMessageState
    {
        $state = self::state();
        $state->onMessageOffered(new ChatMessageOffered(self::CHAT, $messageId, TestActors::agentIdentity(2)));

        return $state;
    }

    public static function answered(): AnswerMessageState
    {
        return self::state();
    }

    private static function state(): AnswerMessageState
    {
        return new AnswerMessageState(self::CHAT, TestActors::agentIdentity(2)->id, new AnswerBudget(0));
    }
}
