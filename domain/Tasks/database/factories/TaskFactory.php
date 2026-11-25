<?php

declare(strict_types=1);

namespace Domain\Tasks\Database\Factories;

use App\Models\Projects\Project;
use App\Support\ActorReference;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * A task as tests and seeders need one: a title, a brief, the journal itself as its creator and the local project,
 * unless they say otherwise.
 *
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * @var class-string<Task>
     */
    protected $model = Task::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $creator = ActorReference::system();

        return [
            'title' => fake()->sentence(4),
            'brief' => 'What the task asks and when it is done.',
            'creator_type' => $creator->type,
            'creator_id' => $creator->id,
            'project_id' => fn (): string => Project::findOrCreateLocal('Journal')->id,
        ];
    }
}
