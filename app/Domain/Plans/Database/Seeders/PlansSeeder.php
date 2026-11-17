<?php

declare(strict_types=1);

namespace App\Domain\Plans\Database\Seeders;

use App\Domain\Plans\Api\PlanKind;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Models\Task;
use Illuminate\Database\Seeder;

/**
 * A few local plans with phases and tasks, so the running app shows real plan cards.
 */
final class PlansSeeder extends Seeder
{
    public function run(): void
    {
        $build = Plan::query()->create(['title' => 'Build the plans page', 'kind' => PlanKind::Build]);
        $build->addPhase('Read the plans')->addTasks($this->tasks('Persist plans and phases', 'List the plans'));
        $build->addPhase('Start a plan')->addTasks($this->tasks('Add the start action', 'Show the start form'));

        $fix = Plan::query()->create(['title' => 'Fix the login redirect', 'kind' => PlanKind::Fix]);
        $fix->addPhase('Reproduce it')->addTasks($this->tasks('Write a failing test'));

        Plan::query()->create(['title' => 'Compare chat layouts', 'kind' => PlanKind::Research]);
    }

    /**
     * @return list<Task>
     */
    private function tasks(string ...$titles): array
    {
        return array_map(fn (string $title) => Task::query()->create(['title' => $title]), array_values($titles));
    }
}
