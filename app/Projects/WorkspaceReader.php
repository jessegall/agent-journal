<?php

declare(strict_types=1);

namespace App\Projects;

use App\Exceptions\WorkspaceReadPending;
use App\Files\Contracts\WorkspaceReader as WorkspaceReaderContract;
use App\Models\Projects\WorkspaceRead;
use App\Support\ActorReference;
use App\Values\WorkReference;
use App\Values\WorkspaceFacts;
use App\Values\WorkspaceReadReference;

/**
 * Reads an actor's checkout through its host: the first read of a reference is retained and pending until the host
 * answers, and every later read of it gives that one answer.
 */
final readonly class WorkspaceReader implements WorkspaceReaderContract
{
    /**
     * @throws WorkspaceReadPending
     */
    public function read(ActorReference $actor, WorkReference $work, WorkspaceReadReference $reference): WorkspaceFacts
    {
        return WorkspaceRead::create($reference, $actor, $work)->facts
            ->getOrThrow(WorkspaceReadPending::for($reference));
    }
}
