<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Contracts\CurrentSession;
use App\Contracts\CommandHandler;
use Domain\Plans\Commands\CreatePlan;
use Domain\Plans\Models\Plan;

final readonly class CreatePlanHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private CurrentSession $session) {}

    public function handle(CreatePlan $command): string
    {
        $creator = $this->actors->actor();

        return Plan::query()->create([
            'title' => $command->title,
            'brief' => $command->brief,
            'type' => $command->type,
            'creator_type' => $creator->type,
            'creator_id' => $creator->id,
            'creator_session_id' => $creator->type === ActorType::Agent ? $this->session->sessionId() : null,
        ])->id;
    }
}
