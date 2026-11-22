<?php

declare(strict_types=1);

namespace App\Values;

use App\Support\ActorIdentity;

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
