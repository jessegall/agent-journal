<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\RequireMessageAnswer\RequireMessageAnswerCommand;
use App\Enums\MessageState;
use App\Exceptions\AnswerImpossible;
use App\Exceptions\MessageMissing;
use App\Models\Messages\Message;
use App\Support\DeskService;
use Tests\Support\MessagingTestCase;

/**
 * The author of a note may ask for an answer to it after all: the note then waits in the same two inboxes. Nobody
 * else may, and an inbox with nobody seated at it cannot answer.
 */
final class RequireMessageAnswerTest extends MessagingTestCase
{
    public function test_the_author_turns_a_note_into_a_question_in_the_same_inboxes(): void
    {
        $noteId = $this->ownerSends($this->inboxIdOf($this->builder), 'The build is red.');

        $this->runOnBus(new RequireMessageAnswerCommand($noteId));
        $this->runOnBus(new RequireMessageAnswerCommand($noteId));

        $note = Message::query()->findOrFail($noteId);
        $this->assertSame(MessageState::WaitingForAnswer, $note->state);
        $this->assertSame($this->ownerInboxId(), $note->source_inbox_id);
        $this->assertSame($this->inboxIdOf($this->builder), $note->destination_inbox_id);
    }

    public function test_only_the_author_may_ask_for_an_answer(): void
    {
        $noteId = $this->ownerSends($this->inboxIdOf($this->builder), 'The build is red.');
        $this->asAgent($this->builder);

        $this->expectException(MessageMissing::class);

        $this->runOnBus(new RequireMessageAnswerCommand($noteId));
    }

    public function test_an_inbox_nobody_is_seated_at_cannot_answer(): void
    {
        $nobody = $this->app->make(DeskService::class)->openSourceDesk('nobody', 'Nobody');
        $noteId = $this->ownerSends($nobody->inboxId(), 'Anyone?');

        $this->expectException(AnswerImpossible::class);

        $this->runOnBus(new RequireMessageAnswerCommand($noteId));
    }
}
