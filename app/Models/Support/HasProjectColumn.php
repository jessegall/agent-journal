<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Contracts\Projects\ProjectOwned;
use App\Exceptions\CrossProjectEdge;
use App\Models\Projects\Project;
use App\Values\ProjectOwner;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * A model whose rows name their project in a project_id column, empty for a Global row.
 */
trait HasProjectColumn
{
    public function projectOwner(): ProjectOwner
    {
        $projectId = $this->getAttribute('project_id');

        if ($projectId === null) {
            return ProjectOwner::global();
        }

        return ProjectOwner::ofProject((string) $projectId);
    }

    /**
     * Writes the owner into the row: the project's id, or empty for Global.
     */
    public function assignOwner(ProjectOwner $owner): void
    {
        $this->setAttribute('project_id', $owner->isGlobal() ? null : $owner->projectId());
    }

    /**
     * Refuses joining this row to the other unless both are of one project or the other is Global.
     *
     * @throws CrossProjectEdge
     */
    public function assertSameProjectAs(ProjectOwned $other): void
    {
        if ($this->projectOwner()->mayJoin($other->projectOwner())) {
            return;
        }

        throw CrossProjectEdge::forRecord(Str::snake(class_basename($this), ' ') . ' ' . $this->getKey());
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
