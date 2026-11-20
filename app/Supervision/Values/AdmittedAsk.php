<?php

declare(strict_types=1);

namespace App\Supervision\Values;

use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;

final readonly class AdmittedAsk
{
    public function __construct(
        public AskReference $ask,
        public ActorIdentity $actor,
        public WorkReference $work,
        public int $version,
        public string|null $head,
    ) {}
}
