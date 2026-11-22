<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\SpeechOpportunityState;
use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * An agent's turn to speak on one user message ended: spent on a contribution, declined or cancelled.
 */
final readonly class SpeechOpportunitySettled implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $opportunityId,
        public string $userRootId,
        public ActorIdentity $speaker,
        public SpeechOpportunityState $state,
    ) {}
}
