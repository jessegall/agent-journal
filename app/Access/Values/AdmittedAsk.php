<?php

declare(strict_types=1);

namespace App\Access\Values;

use App\Support\ActorReference;
use App\Values\AskReference;
use App\Values\WorkReference;

final readonly class AdmittedAsk
{
    public function __construct(
        public AskReference $ask,
        public ActorReference $actor,
        public WorkReference $work,
        public int $version,
        public string|null $head,
    ) {}
}
