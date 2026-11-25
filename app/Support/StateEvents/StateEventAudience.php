<?php

declare(strict_types=1);

namespace App\Support\StateEvents;

use App\Contracts\Authorization\AuthoritySource;
use App\Support\ActorIdentity;
use App\Support\AgentContext;
use App\Support\SystemActor;
use App\Values\FrameGrant;
use App\Values\StackTarget;
use App\Values\TrustedEntryAuthority;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The original actor, authority and resolved targets admitted for an event.
 */
final readonly class StateEventAudience
{
    /**
     * @param  list<StackTarget>  $targets
     * @param  Option<AgentContext>  $session
     * @param  Option<FrameGrant>  $engineFrame
     */
    public function __construct(
        public ActorIdentity $actor,
        public AuthoritySource $authority,
        public array $targets,
        public Option $session,
        public Option $engineFrame,
    ) {}

    /**
     * The caller of what a state answers to a fact it heard by listening on its own stack: the engine, under a grant
     * for that one frame, as for a ticking state.
     */
    public static function listening(StackTarget $target, string $frameId): self
    {
        return new self(
            ActorIdentity::of(new SystemActor()),
            new TrustedEntryAuthority('state listener'),
            [$target],
            None::create(),
            new Some(new FrameGrant($target, $frameId)),
        );
    }

    public function allowsTarget(StackTarget $target): bool
    {
        return array_any($this->targets, fn (StackTarget $admitted) => $admitted->isSameAs($target));
    }
}
