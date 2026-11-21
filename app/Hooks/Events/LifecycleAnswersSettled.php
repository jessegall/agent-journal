<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Actors\Contracts\AuthoritySource;
use App\Actors\Support\ActorContext;
use App\Contracts\Event;
use App\Hooks\Lifecycle\LifecycleAnswer;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A stack change settled and its lifecycle callbacks answered with commands, with the actor that made the change and
 * its authority, which the commands run under; heard after the change commits, so a rolled-back change leaves nothing
 * to run.
 */
final readonly class LifecycleAnswersSettled implements Event, ShouldDispatchAfterCommit
{
    /**
     * @param  list<LifecycleAnswer>  $answers
     */
    public function __construct(
        public array $answers,
        public ActorContext $actor,
        public AuthoritySource $authority,
    ) {}
}
