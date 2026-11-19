<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Communication\Commands\ReadMessages;
use App\Communication\Support\PendingInboxWork;
use Tests\Support\MessagingTestCase;

/**
 * An actor's pending inbox work is every message in its inboxes it has not read, and every question still waiting,
 * read or not; a note once read is no longer pending.
 */
final class PendingInboxWorkTest extends MessagingTestCase
{
    public function test_unread_notes_and_waiting_questions_are_pending(): void
    {
        $note = $this->ownerSends($this->inboxIdOf($this->builder), 'FYI.');
        $question = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');

        $this->assertSame(2, $this->pendingFor());

        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessages($this->inboxIdOf($this->builder), [$note, $question]));

        $this->assertSame(1, $this->pendingFor());
        $this->assertSame(0, $this->app->make(PendingInboxWork::class)->pendingCount($this->actorOf($this->reviewer)));
    }

    private function pendingFor(): int
    {
        return $this->app->make(PendingInboxWork::class)->pendingCount($this->actorOf($this->builder));
    }
}
