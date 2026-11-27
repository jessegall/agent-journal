<?php

declare(strict_types=1);

namespace App\Messages\Commands\OfferClosingWords;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStackCommand;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\StackTarget;

/**
 * Offers the agent's closing words of a turn to send: the turn keeps them until the agent sends or keeps them.
 *
 * @extends Command<void>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class OfferClosingWordsCommand extends Command implements AgentStackCommand
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $turnId,
        public string $words,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
