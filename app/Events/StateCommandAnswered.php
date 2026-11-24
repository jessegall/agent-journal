<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Authorization\AuthoritySource;
use App\Contracts\Bus\Command;
use App\Support\ActorContext;
use App\Values\StackTarget;

/**
 * A state answered a hook or a moment of its frame's life with a command, which runs under the actor and authority
 * of the change once it commits, so a rolled-back change leaves nothing to run.
 */
final readonly class StateCommandAnswered extends HookEvent
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
