<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests;

/**
 * Answers the fixture keyed write without running any command, so it takes no receipt: the receipt guard must catch
 * it.
 */
final readonly class WriteNoteController
{
    public function __invoke(WriteNoteCall $call): NoteAnswer
    {
        return new NoteAnswer("{$call->notebookId}:{$call->text}");
    }
}
