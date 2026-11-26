<?php

declare(strict_types=1);

namespace App\Files\Contracts;

use App\Support\ActorReference;
use App\Values\WorkReference;
use App\Values\WorkspaceFacts;
use App\Values\WorkspaceReadReference;

interface WorkspaceReader
{
    /**
     * What the actor's workspace for the work holds at the read the reference names: whether it is there, clean and at
     * which commit.
     */
    public function read(ActorReference $actor, WorkReference $work, WorkspaceReadReference $reference): WorkspaceFacts;
}
