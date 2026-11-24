<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\ActorIdentity;
use App\Values\WorkReference;
use Carbon\CarbonImmutable;

interface WorkProgress
{
    /**
     * When the actor took up the work; none when it never did.
     */
    public function enteredAt(ActorIdentity $actor, WorkReference $work): CarbonImmutable|null;
}
