<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Hooks\Readers\FrameProgress;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\Bind;

#[Bind(FrameProgress::class)]
interface WorkProgress
{
    public function enteredAt(ActorIdentity $actor, WorkReference $work): CarbonImmutable|null;
}
