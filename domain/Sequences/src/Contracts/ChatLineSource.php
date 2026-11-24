<?php

declare(strict_types=1);

namespace Domain\Sequences\Contracts;

use App\Support\ActorIdentity;
use Domain\Sequences\Models\SequenceRun;

/**
 * A fact of a sequence run that its agent's chats show as a plain line: which run, whose, and the words for it.
 */
interface ChatLineSource
{
    /**
     * The id of the sequence run the chat line is about.
     */
    public function runId(): string;

    /**
     * The actor who follows the sequence run.
     */
    public function follower(): ActorIdentity;

    /**
     * The line the chat shows for the run.
     */
    public function wordsFor(SequenceRun $run): string;
}
