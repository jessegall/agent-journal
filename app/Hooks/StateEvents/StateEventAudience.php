<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Actors\Contracts\AuthoritySource;
use App\Actors\Support\ActorContext;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Hooks\Values\FrameGrant;
use PhpOption\Option;

/**
 * The original actor, authority and resolved targets admitted for an event.
 */
final readonly class StateEventAudience
{
    /**
     * @param list<StackTarget> $targets
     * @param Option<AgentContext> $session
     * @param Option<FrameGrant> $engineFrame
     */
    public function __construct(
        public ActorContext $actor,
        public AuthoritySource $authority,
        public array $targets,
        public Option $session,
        public Option $engineFrame,
    ) {}

    public function allowsTarget(StackTarget $target): bool
    {
        return array_any($this->targets, fn (StackTarget $admitted) => $admitted->isSameAs($target));
    }
}
