<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\WorkspaceReader;
use App\Agents\Exceptions\WorkspaceReadPending;
use App\Agents\Models\WorkspaceRead;
use App\Agents\Values\WorkReference;
use App\Agents\Values\WorkspaceFacts;
use App\Agents\Values\WorkspaceReadReference;

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
