<?php

declare(strict_types=1);

namespace App\Domain\Agents;

use App\Domain\Domain;

final class AgentsDomain implements Domain
{
    public function description(): string
    {
        return 'Running agents and their sessions; a helper is a kind of agent.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
