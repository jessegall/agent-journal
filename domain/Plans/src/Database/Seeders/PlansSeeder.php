<?php

declare(strict_types=1);

namespace Domain\Plans\Database\Seeders;

use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Database\Seeder;

/**
 * A few local plans with phases, so the running app shows real plan cards. The tasks come from Tasks' seeder, by id
 * and grouped by example phase; without them the phases stay empty.
 */
final class PlansSeeder extends Seeder
{
    /**
     * @param  list<int>  $readingTaskIds  the tasks of the reading phase
     * @param  list<int>  $startingTaskIds  the tasks of the starting phase
     * @param  list<int>  $reproducingTaskIds  the tasks of the reproducing phase
     */
    public function run(array $readingTaskIds = [], array $startingTaskIds = [], array $reproducingTaskIds = []): void
    {
        $build = Plan::query()->create(['title' => 'Build the plans page', 'type' => PlanType::Build]);
        $build->addPhase('Read the plans')->addTasks($readingTaskIds);
        $build->addPhase('Start a plan')->addTasks($startingTaskIds);

        $fix = Plan::query()->create(['title' => 'Fix the login redirect', 'type' => PlanType::Fix]);
        $fix->addPhase('Reproduce it')->addTasks($reproducingTaskIds);

        Plan::query()->create(['title' => 'Compare chat layouts', 'type' => PlanType::Research]);
    }
}
