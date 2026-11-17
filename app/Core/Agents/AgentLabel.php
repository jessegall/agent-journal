<?php

declare(strict_types=1);

namespace App\Core\Agents;

/**
 * An agent as a page may name it: its id and display name.
 */
final readonly class AgentLabel
{
    public function __construct(
        public int $agentId,
        public string $name,
    ) {}
}
