<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Events\Messages\MessageSent;
use App\Stacks\AnswerMessageState;
use App\Stacks\Values\AnswerBudget;
use Tests\Support\TestActors;

/**
 * Answering states of agent 2 in chat 1 for stack tests: one that holds the agent to answer a message at once, and one
 * whose message the agent has answered.
 */
final class AnswerStates
{
    public const string CHAT = 'chat-1';

    private const string ANSWERED_MESSAGE = 'answered-message';

    public static function holding(string $messageId): AnswerMessageState
    {
        return self::stateFor($messageId);
    }

    public static function answered(): AnswerMessageState
    {
        $state = self::stateFor(self::ANSWERED_MESSAGE);
        $state->onMessageSent(new MessageSent('reply', self::CHAT, 2, self::ANSWERED_MESSAGE, TestActors::agentIdentity(2)));

        return $state;
    }

    private static function stateFor(string $messageId): AnswerMessageState
    {
        return new AnswerMessageState($messageId, 1, self::CHAT, TestActors::agentIdentity(2)->id, new AnswerBudget(0));
    }
}
