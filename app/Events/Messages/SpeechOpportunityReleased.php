<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\SpeechOpportunityEvent;

/**
 * A claimed speech opportunity was offered again.
 */
final readonly class SpeechOpportunityReleased extends MessageEvent implements SpeechOpportunityEvent
{
    public function __construct(public string $opportunityId) {}
}
