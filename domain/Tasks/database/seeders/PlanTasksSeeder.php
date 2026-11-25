<?php

declare(strict_types=1);

namespace Domain\Tasks\Database\Seeders;

use Domain\Tasks\Models\Task;
use Illuminate\Database\Seeder;

/**
 * The example tasks of the local plans, created by Tasks and handed on by id, grouped by the example phase they
 * belong in, so the plans seeder never creates a task itself. A task already seeded is handed on again, so seeding
 * twice adds nothing.
 */
final class PlanTasksSeeder extends Seeder
{
    /**
     * @return list<string>
     */
    public function readingTaskIds(): array
    {
        return $this->tasks('Persist plans and phases', 'List the plans');
    }

    /**
     * @return list<string>
     */
    public function startingTaskIds(): array
    {
        return $this->tasks('Add the start action', 'Show the start form');
    }

    /**
     * @return list<string>
     */
    public function reproducingTaskIds(): array
    {
        return $this->tasks('Write a failing test');
    }

    /**
     * @return list<string>
     */
    private function tasks(string ...$titles): array
    {
        return array_map(
            fn (string $title) => Task::query()->withTitle($title)->firstOr(
                fn () => Task::factory()->create(['title' => $title]),
            )->id,
            array_values($titles),
        );
    }
}
