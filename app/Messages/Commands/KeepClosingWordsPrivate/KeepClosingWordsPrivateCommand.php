<?php

declare(strict_types=1);

namespace App\Messages\Commands\KeepClosingWordsPrivate;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStackCommand;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\StackTarget;

/**
 * The agent stopped again with the closing words it was offered to send: they stay private.
 *
 * @extends Command<void>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class KeepClosingWordsPrivateCommand extends Command implements AgentStackCommand
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $turnId,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
