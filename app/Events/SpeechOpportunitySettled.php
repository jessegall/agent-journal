<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\SpeechOpportunityEvent;
use App\Enums\SpeechOpportunityState;
use App\Support\ActorIdentity;

/**
 * An agent's turn to speak on one user message ended: spent on a contribution, declined or cancelled.
 */
final readonly class SpeechOpportunitySettled extends MessageEvent implements SpeechOpportunityEvent
{
    public function __construct(
        public string $opportunityId,
        public string $userRootId,
        public ActorIdentity $speaker,
        public SpeechOpportunityState $state,
    ) {}
}
