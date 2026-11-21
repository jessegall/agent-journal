<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\AnswerImpossible;
use App\Communication\Models\Message;
use App\Desks\Support\DeskOpening;
use Tests\Support\MessagingTestCase;

/**
 * A question waits for an answer in its destination inbox; an inbox nobody is seated at cannot answer, so asking it
 * is refused and leaves nothing.
 */
final class AskMessageTest extends MessagingTestCase
{
    public function test_an_asked_message_waits_for_an_answer(): void
    {
        $messageId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which database?');

        $this->assertSame(MessageState::WaitingForAnswer, Message::query()->findOrFail($messageId)->state);
    }

    public function test_asking_an_inbox_nobody_is_seated_at_is_refused(): void
    {
        $nobody = $this->app->make(DeskOpening::class)->openSourceDesk('nobody', 'Nobody');

        $this->assertThrows(fn () => $this->ownerAsks($nobody->inboxId(), 'Anyone?'), AnswerImpossible::class);
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }
}
