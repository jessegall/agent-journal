<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use Carbon\CarbonImmutable;

interface WorkProgress
{
    public function enteredAt(ActorIdentity $actor, WorkReference $work): CarbonImmutable|null;
}
