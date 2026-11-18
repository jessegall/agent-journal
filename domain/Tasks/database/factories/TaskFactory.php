<?php

declare(strict_types=1);

namespace Domain\Tasks\Database\Factories;

use App\Actors\Support\ActorIdentity;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * A task as tests and seeders need one: a title, a brief and the journal itself as its creator, unless they say
 * otherwise.
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
        $creator = ActorIdentity::system();

        return [
            'title' => fake()->sentence(4),
            'brief' => 'What the task asks and when it is done.',
            'creator_type' => $creator->type,
            'creator_id' => $creator->id,
        ];
    }
}
