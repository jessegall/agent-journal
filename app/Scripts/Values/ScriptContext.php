<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Agents\Values\WorkspaceReadReference;
use App\Profiles\Values\ProfileRevisionReference;

final readonly class ScriptContext
{
    public function __construct(
        public ActorIdentity $actor,
        public WorkReference $work,
        public ProfileRevisionReference $profile,
        public string $trigger,
        public WorkspaceReadReference $read,
    ) {}
}
