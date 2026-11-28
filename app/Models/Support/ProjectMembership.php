<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Projects\Contracts\CurrentProject;
use App\Values\ProjectSelection;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * For a model whose every row belongs to one project: a query sees only the rows of the current project selection.
 */
trait ProjectMembership
{
    use HasProjectColumn;

    public static function bootProjectMembership(): void
    {
        static::addGlobalScope(new ProjectScope(
            static fn (): ProjectSelection => Container::getInstance()->make(CurrentProject::class)->selection(),
            static::showsGlobalRows(),
        ));
    }

    /**
     * Whether rows without a project, the Global ones, show under every selection.
     */
    protected static function showsGlobalRows(): bool
    {
        return false;
    }

    /**
     * The journal's own read across projects; the only lift of the scope.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function acrossProjects(Builder $query): void
    {
        $query->withoutGlobalScope(ProjectScope::class);
    }

    /**
     * The journal's explicit read of one project's rows, whatever the selection.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function inProject(Builder $query, string $projectId): void
    {
        $query->withoutGlobalScope(ProjectScope::class)->where($query->qualifyColumn('project_id'), $projectId);
    }
}
