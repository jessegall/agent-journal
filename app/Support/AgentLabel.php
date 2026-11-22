<?php

declare(strict_types=1);

namespace App\Support;

/**
 * An agent as a page may name it: its id and display name.
 */
final readonly class AgentLabel
{
    public function __construct(
        public string $agentId,
        public string $name,
    ) {}
}
