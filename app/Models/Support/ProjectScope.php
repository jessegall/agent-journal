<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Projects\Enums\ProjectSelectionType;
use App\Values\ProjectSelection;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits a model to the rows of the current project selection. It asks for the selection on every query, so a worker
 * that serves many requests never keeps an earlier request's choice.
 *
 * @implements Scope<Model>
 */
final readonly class ProjectScope implements Scope
{
    /**
     * @param  Closure(): ProjectSelection  $selection
     */
    public function __construct(
        private Closure $selection,
        private bool $showsGlobal,
    ) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        $selection = ($this->selection)();
        $column = $model->qualifyColumn('project_id');

        if ($selection->type === ProjectSelectionType::All) {
            return;
        }

        if ($selection->type === ProjectSelectionType::None && $this->showsGlobal) {
            $builder->whereNull($column);

            return;
        }

        if ($selection->type === ProjectSelectionType::None) {
            $builder->whereKey([]);

            return;
        }

        if (! $this->showsGlobal) {
            $builder->where($column, $selection->projectId());

            return;
        }

        $builder->where(fn (Builder $query) => $query->where($column, $selection->projectId())->orWhereNull($column));
    }
}
