<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Authorization\AuthoritySource;
use App\Contracts\Bus\Command;
use App\Support\ActorContext;
use App\Values\StackTarget;

/**
 * A state answered a hook with a command, which runs under the hook's actor and authority once the hook commits, so a
 * rolled-back hook leaves nothing to run.
 */
final readonly class HookCommandAnswered extends HookEvent
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
