<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Plans\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Tests\Fixtures\Boundary\Tables\Tasks\Models\Task;

#[Fillable(['title'])]
final class Plan extends Model
{
    /**
     * @return BelongsToMany<Task, $this>
     */
    public function inferredTasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class);
    }

    /**
     * @return BelongsToMany<Task, $this>
     */
    public function writtenTasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'plan_task');
    }
}
