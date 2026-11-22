<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\ChatLines;
use App\Contracts\Listener;
use App\Enums\ActorType;
use App\Events\StartAccepted;
use App\Models\Agent;
use App\Support\ActorIdentity;

/**
 * A helper's start shows in the chats of the agent that started it, as one quiet line naming the helper.
 */
final readonly class ShowHelperStartInChat implements Listener
{
    public function __construct(private ChatLines $lines) {}

    public function handle(StartAccepted $fact): void
    {
        if ($fact->parentAgentId === null) {
            return;
        }

        $this->lines->post(
            new ActorIdentity(ActorType::Agent, $fact->parentAgentId),
            Agent::query()->findOrFail($fact->agentId)->name,
            'started as a helper',
        );
    }
}
