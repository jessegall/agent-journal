<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Events\Messages\MessageRead;
use App\Support\StateLoading\StateValues;
use App\Support\States\ReadMessageState;
use App\Values\AnswerBudget;
use Tests\Support\MessagingTestCase;

/**
 * The reading state finds what its agent has not read when it goes live: messages already waiting in the inbox hold
 * the agent until each is read.
 */
final class ReadMessageEntryTest extends MessagingTestCase
{
    public function test_messages_waiting_when_the_state_enters_hold_the_agent_until_they_are_read(): void
    {
        $inboxId = $this->pairInboxIdOf($this->builder);
        $first = $this->ownerSends($inboxId, 'The first note.');
        $second = $this->ownerSends($inboxId, 'The second note.');
        $state = new ReadMessageState($inboxId, $this->builder->agent_id, new AnswerBudget(2));

        $state->onEnter();

        $this->assertSame([$first, $second], StateValues::of($state)['unreadIds']);
        $this->assertFalse($state->isFinished());

        $reader = $this->actorOf($this->builder);
        iterator_to_array($state->onMessageRead(new MessageRead($first, $inboxId, $reader)));
        $this->assertFalse($state->isFinished());

        iterator_to_array($state->onMessageRead(new MessageRead($second, $inboxId, $reader)));
        $this->assertTrue($state->isFinished());
    }
}
