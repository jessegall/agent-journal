<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\SpeechOpportunityEvent;

/**
 * An agent claimed a speech opportunity for a short lease.
 */
final readonly class SpeechOpportunityClaimed extends MessageEvent implements SpeechOpportunityEvent
{
    public function __construct(public string $opportunityId) {}
}
