<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskWaitChange;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $task_wait_id
 * @property string $dependent_task_id
 * @property string $prerequisite_task_id
 * @property TaskWaitChange $change
 * @property string $actor_type
 * @property string $actor_id
 * @property string|null $reason
 * @property string|null $batch_id
 * @property CarbonImmutable $created_at
 *
 * @mixin \Eloquent
 */
#[Table('task_wait_history')]
final class TaskWaitHistory extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'change' => TaskWaitChange::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Keeps the change of the wait, made by the actor, with its reason when it has one.
     */
    public static function create(
        TaskWait $wait,
        TaskWaitChange $change,
        ActorIdentity $actor,
        string|null $reason,
        string|null $batchId,
    ): self {
        $taskWaitHistory = new self();
        $taskWaitHistory->task_wait_id = $wait->id;
        $taskWaitHistory->dependent_task_id = $wait->dependent_task_id;
        $taskWaitHistory->prerequisite_task_id = $wait->prerequisite_task_id;
        $taskWaitHistory->change = $change;
        $taskWaitHistory->actor_type = $actor->type;
        $taskWaitHistory->actor_id = $actor->id;
        $taskWaitHistory->reason = $reason;
        $taskWaitHistory->batch_id = $batchId;
        $taskWaitHistory->save();

        return $taskWaitHistory;
    }
}
