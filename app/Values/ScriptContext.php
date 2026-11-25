<?php

declare(strict_types=1);

namespace App\Values;

use App\Support\ActorReference;

final readonly class ScriptContext
{
    public function __construct(
        public ActorReference $actor,
        public WorkReference $work,
        public ProfileRevisionReference $profile,
        public string $trigger,
        public WorkspaceReadReference $read,
    ) {}
}
