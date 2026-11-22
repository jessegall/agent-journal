<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;
use App\Values\WorkReference;
use App\Values\WorkspaceFacts;
use App\Values\WorkspaceReadReference;

interface WorkspaceReader
{
    public function read(ActorIdentity $actor, WorkReference $work, WorkspaceReadReference $reference): WorkspaceFacts;
}
