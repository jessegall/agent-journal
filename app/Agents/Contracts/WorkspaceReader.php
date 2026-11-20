<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Agents\Values\WorkspaceFacts;
use App\Agents\Values\WorkspaceReadReference;

interface WorkspaceReader
{
    public function read(ActorIdentity $actor, WorkReference $work, WorkspaceReadReference $reference): WorkspaceFacts;
}
