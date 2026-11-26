<?php

declare(strict_types=1);

namespace App\Processes\Readers\Contracts\Work;

use App\Support\ActorReference;
use App\Values\WorkReference;
use Carbon\CarbonImmutable;

interface WorkProgress
{
    /**
     * When the actor took up the work; none when it never did.
     */
    public function enteredAt(ActorReference $actor, WorkReference $work): CarbonImmutable|null;
}
