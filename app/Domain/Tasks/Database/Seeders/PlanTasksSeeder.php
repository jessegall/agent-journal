<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Database\Seeders;

use App\Domain\Tasks\Models\Task;
use Illuminate\Database\Seeder;

/**
 * The example tasks of the local plans, created by Tasks and handed on by id, grouped by the example phase they
 * belong in, so the plans seeder never creates a task itself.
 */
final class PlanTasksSeeder extends Seeder
{
    /**
     * @return list<int>
     */
    public function readingTaskIds(): array
    {
        return $this->tasks('Persist plans and phases', 'List the plans');
    }

    /**
     * @return list<int>
     */
    public function startingTaskIds(): array
    {
        return $this->tasks('Add the start action', 'Show the start form');
    }

    /**
     * @return list<int>
     */
    public function reproducingTaskIds(): array
    {
        return $this->tasks('Write a failing test');
    }

    /**
     * @return list<int>
     */
    private function tasks(string ...$titles): array
    {
        return array_map(fn (string $title) => Task::query()->create(['title' => $title])->id, array_values($titles));
    }
}
