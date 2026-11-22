<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

/**
 * Where a started driver reaches the journal and the token it signs its calls with, both given to its environment
 * by the start.
 */
final readonly class AgentClientSettings
{
    public function __construct(
        public string $journalUrl,
        public string $token,
        public StartProfilePin $profile,
        public int $timeoutSeconds = 10,
    ) {}
}
