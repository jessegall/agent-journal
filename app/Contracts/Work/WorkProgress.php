<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\ActorIdentity;
use App\Values\WorkReference;
use Carbon\CarbonImmutable;

interface WorkProgress
{
    public function enteredAt(ActorIdentity $actor, WorkReference $work): CarbonImmutable|null;
}
