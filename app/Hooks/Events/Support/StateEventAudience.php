<?php

declare(strict_types=1);

namespace App\Hooks\Events\Support;

use App\Actors\Contracts\AuthoritySource;
use App\Actors\Support\ActorContext;
use App\Agents\Support\StackTarget;

/**
 * The original actor, authority and resolved targets admitted for an event.
 */
final readonly class StateEventAudience
{
    /**
     * @param list<StackTarget> $targets
     */
    public function __construct(
        public ActorContext $actor,
        public AuthoritySource $authority,
        public array $targets,
    ) {}

    public function allowsTarget(StackTarget $target): bool
    {
        return array_any($this->targets, fn (StackTarget $admitted) => $admitted->isSameAs($target));
    }
}
