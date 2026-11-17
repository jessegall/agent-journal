<?php

declare(strict_types=1);

namespace App\Domain\Plans\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * A task's place in a phase. It keeps the task id only; the task itself stays in Tasks.
 *
 * @property int $id
 * @property int $phase_id
 * @property int $task_id
 * @property int $position
 */
#[Fillable(['phase_id', 'task_id', 'position'])]
final class PhaseTask extends Model
{
    public $timestamps = false;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['phase_id' => 'integer', 'task_id' => 'integer', 'position' => 'integer'];
    }
}
