<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * What a host's report of a request says it answers, as the claim handed it: the session, the session's supervised
 * start and the process generation.
 */
final readonly class RequestReportBinding
{
    public function __construct(
        public string $sessionId,
        public string|null $processStartId,
        public int $processGeneration,
    ) {}
}
