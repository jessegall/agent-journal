<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Actors\Contracts\AuthoritySource;
use App\Actors\Support\ActorContext;
use App\Agents\Values\StackTarget;
use App\Bus\Contracts\Command;
use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A state answered a hook with a command, which runs under the hook's actor and authority once the hook commits, so a
 * rolled-back hook leaves nothing to run.
 */
final readonly class HookCommandAnswered implements Event, ShouldDispatchAfterCommit
{
    /**
     * @param  Command<mixed>  $command
     */
    public function __construct(
        public StackTarget $target,
        public Command $command,
        public ActorContext $actor,
        public AuthoritySource $authority,
    ) {}
}
