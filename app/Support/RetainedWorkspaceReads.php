<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\WorkspaceReader;
use App\Exceptions\WorkspaceReadPending;
use App\Models\WorkspaceRead;
use App\Values\WorkReference;
use App\Values\WorkspaceFacts;
use App\Values\WorkspaceReadReference;

/**
 * Reads an actor's checkout through its host: the first read of a reference is retained and pending until the host
 * answers, and every later read of it gives that one answer.
 */
final readonly class RetainedWorkspaceReads implements WorkspaceReader
{
    /**
     * @throws WorkspaceReadPending
     */
    public function read(ActorIdentity $actor, WorkReference $work, WorkspaceReadReference $reference): WorkspaceFacts
    {
        return WorkspaceRead::retain($reference, $actor, $work)->facts()
            ->getOrThrow(WorkspaceReadPending::for($reference));
    }
}
