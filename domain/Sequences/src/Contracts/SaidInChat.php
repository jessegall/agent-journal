<?php

declare(strict_types=1);

namespace Domain\Sequences\Contracts;

use App\Support\ActorIdentity;
use Domain\Sequences\Models\SequenceRun;

/**
 * A fact of a sequence run that its agent's chats say in a plain line: which run, whose, and the words for it.
 */
interface SaidInChat
{
    public function runId(): string;

    public function follower(): ActorIdentity;

    public function wordsFor(SequenceRun $run): string;
}
