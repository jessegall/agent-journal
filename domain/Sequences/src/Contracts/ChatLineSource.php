<?php

declare(strict_types=1);

namespace Domain\Sequences\Contracts;

use App\Support\ActorIdentity;
use App\Support\RecordIdentity;

/**
 * A fact of a sequence run that its follower's chat shows: which run, and whose.
 */
interface ChatLineSource
{
    /**
     * The sequence run the chat line is about.
     */
    public function run(): RecordIdentity;

    /**
     * The actor who follows the sequence run.
     */
    public function follower(): ActorIdentity;
}
