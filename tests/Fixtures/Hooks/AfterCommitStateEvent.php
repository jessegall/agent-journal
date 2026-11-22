<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Agents\Values\StackTarget;
use App\Contracts\Event;

/**
 * An event whose payload can name a stack independently of the admitted scope.
 */
final readonly class AfterCommitStateEvent implements Event
{
    public function __construct(public StackTarget $claimedTarget) {}
}
