<?php

declare(strict_types=1);

namespace Domain\Plans\Database\Seeders;

use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Illuminate\Database\Seeder;

/**
 * A few local plans with phases, so the running app shows real plan cards. The tasks come from Tasks' seeder, by id
 * and grouped by example phase; without them the phases stay empty. Once seeded, seeding again adds nothing.
 */
final class PlansSeeder extends Seeder
{
    private const string BUILD_TITLE = 'Build the plans page';

    /**
     * @param  list<string>  $readingTaskIds  the tasks of the reading phase
     * @param  list<string>  $startingTaskIds  the tasks of the starting phase
     * @param  list<string>  $reproducingTaskIds  the tasks of the reproducing phase
     */
    public function run(
        PlanStructure $structure,
        array $readingTaskIds = [],
        array $startingTaskIds = [],
        array $reproducingTaskIds = [],
    ): void {
        if (Plan::query()->where('title', self::BUILD_TITLE)->exists()) {
            return;
        }

        $build = Plan::factory()->create(['title' => self::BUILD_TITLE, 'type' => PlanType::Build]);
        $structure->addTasks($structure->addPhase($build, 'Read the plans'), $readingTaskIds);
        $structure->addTasks($structure->addPhase($build, 'Start a plan'), $startingTaskIds);

        $fix = Plan::factory()->create(['title' => 'Fix the login redirect', 'type' => PlanType::Fix]);
        $structure->addTasks($structure->addPhase($fix, 'Reproduce it'), $reproducingTaskIds);

        Plan::factory()->create(['title' => 'Compare chat layouts', 'type' => PlanType::Research]);
    }
}
