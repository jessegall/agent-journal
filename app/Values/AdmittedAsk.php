<?php

declare(strict_types=1);

namespace App\Values;

use App\Support\ActorReference;

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
