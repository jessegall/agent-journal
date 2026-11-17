<?php

declare(strict_types=1);

namespace App\Domain\Plans\Database\Seeders;

use App\Domain\Plans\Api\PlanKind;
use App\Domain\Plans\Models\Plan;
use Illuminate\Database\Seeder;

/**
 * A few local plans with phases, so the running app shows real plan cards. The tasks come from Tasks' seeder, by id
 * and grouped by example phase; without them the phases stay empty.
 */
final class PlansSeeder extends Seeder
{
    /**
     * @param  array<string, list<int>>  $taskIdsOfPhase  task ids by example phase: read, start and reproduce
     */
    public function run(array $taskIdsOfPhase = []): void
    {
        $build = Plan::query()->create(['title' => 'Build the plans page', 'kind' => PlanKind::Build]);
        $build->addPhase('Read the plans')->addTasks($taskIdsOfPhase['read'] ?? []);
        $build->addPhase('Start a plan')->addTasks($taskIdsOfPhase['start'] ?? []);

        $fix = Plan::query()->create(['title' => 'Fix the login redirect', 'kind' => PlanKind::Fix]);
        $fix->addPhase('Reproduce it')->addTasks($taskIdsOfPhase['reproduce'] ?? []);

        Plan::query()->create(['title' => 'Compare chat layouts', 'kind' => PlanKind::Research]);
    }
}
