<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Tasks\Enums\TaskWaitChange;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One change of a wait between two tasks, kept for good: who added, removed or waived it, when, and why.
 *
 * @property string $id
 * @property string $task_wait_id
 * @property string $dependent_task_id
 * @property string $prerequisite_task_id
 * @property TaskWaitChange $change
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string|null $reason
 * @property Carbon $created_at
 */
#[Table('task_wait_history')]
#[Fillable([
    'task_wait_id',
    'dependent_task_id',
    'prerequisite_task_id',
    'change',
    'actor_type',
    'actor_id',
    'reason',
])]
final class TaskWaitHistory extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'change' => TaskWaitChange::class,
            'actor_type' => ActorType::class,
            'created_at' => 'datetime',
        ];
    }

    /**
     * Keeps the change of the wait, made by the actor, with its reason when it has one.
     */
    public static function create(
        TaskWait $wait,
        TaskWaitChange $change,
        ActorIdentity $actor,
        string|null $reason,
    ): self {
        return self::query()->create([
            'task_wait_id' => $wait->id,
            'dependent_task_id' => $wait->dependent_task_id,
            'prerequisite_task_id' => $wait->prerequisite_task_id,
            'change' => $change,
            'actor_type' => $actor->type,
            'actor_id' => $actor->id,
            'reason' => $reason,
        ]);
    }
}
