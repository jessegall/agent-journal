<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkspaceFacts;
use App\Agents\Values\WorkspaceReadReference;
use App\Agents\Values\WorkReference;

interface WorkspaceReader
{
    public function read(ActorIdentity $actor, WorkReference $work, WorkspaceReadReference $reference): WorkspaceFacts;
}
