<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * A task's place in a phase. It keeps the task id only; the task itself stays in Tasks.
 *
 * @property int $id
 * @property int $phase_id
 * @property int $task_id
 * @property int $position
 */
#[Table('phase_tasks', incrementing: true)]
#[Fillable(['phase_id', 'task_id', 'position'])]
final class PhaseTask extends Pivot
{
    use Linkable;

    /**
     * A pivot opens every attribute by default; this one takes only its Fillable list.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

    public $timestamps = false;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['phase_id' => 'integer', 'task_id' => 'integer', 'position' => 'integer'];
    }
}
