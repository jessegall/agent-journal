<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Agents\Support\StackTarget;
use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * An event whose payload can name a stack independently of the admitted scope.
 */
final readonly class AfterCommitStateEvent implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public StackTarget $claimedTarget) {}
}
