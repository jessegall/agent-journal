<?php

declare(strict_types=1);

namespace Domain\Plans\Database\Factories;

use App\Models\Projects\Project;
use App\Support\ActorReference;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * A plan as tests and seeders need one: a title, a brief, a type, the journal itself as its creator and the local
 * project, unless they say otherwise.
 *
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    /**
     * @var class-string<Plan>
     */
    protected $model = Plan::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $creator = ActorReference::system();

        return [
            'title' => fake()->sentence(4),
            'brief' => 'What the plan sets out to do.',
            'type' => PlanType::Build,
            'creator_type' => $creator->type,
            'creator_id' => $creator->id,
            'project_id' => fn (): string => Project::createForLocal('Journal')->id,
        ];
    }

    /**
     * A plan its owner paused.
     */
    public function paused(): self
    {
        return $this->state(['status' => PlanStatus::Paused]);
    }
}
