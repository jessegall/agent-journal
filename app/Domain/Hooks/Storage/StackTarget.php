<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Storage;

/**
 * The agent and journal session one stack belongs to.
 */
final readonly class StackTarget
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
    ) {}
}
