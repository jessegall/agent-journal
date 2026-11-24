<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\SpeechOpportunityEvent;

/**
 * A speech opportunity was kept for the question given.
 */
final readonly class SpeechOpportunityReserved extends MessageEvent implements SpeechOpportunityEvent
{
    public function __construct(public string $opportunityId, public string $questionId) {}
}
