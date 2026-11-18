<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use Domain\Plans\Commands\CreatePlan;
use Domain\Plans\Models\Plan;

final readonly class CreatePlanHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    public function handle(CreatePlan $command): string
    {
        $creator = $this->actors->actor();

        return Plan::draft($command->title, $command->brief, $command->type, $creator)->id;
    }
}
