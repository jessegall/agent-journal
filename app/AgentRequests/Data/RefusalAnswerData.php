<?php

declare(strict_types=1);

namespace App\AgentRequests\Data;

use Spatie\LaravelData\Data;

/**
 * The refusal the journal answers a failed call with: its code, a message for the agent and any details.
 */
final class RefusalAnswerData extends Data
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(
        public readonly string $code,
        public readonly string $message,
        public readonly array $details = [],
    ) {}
}
