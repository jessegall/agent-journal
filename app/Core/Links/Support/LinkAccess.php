<?php

declare(strict_types=1);

namespace App\Core\Links\Support;

use App\Core\Links\Models\Link;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * The links of one model, read only through a query of models the caller may already see.
 */
final readonly class LinkAccess
{
    public function __construct(private Model $model) {}

    /**
     * Narrows a query of visible models to those linked to this model, in either direction.
     *
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $visibleModels
     * @return Builder<TModel>
     */
    public function among(Builder $visibleModels): Builder
    {
        $other = $visibleModels->getModel();
        $key = $other->getQualifiedKeyName();

        return $visibleModels->where(fn (Builder $linked) => $linked
            ->whereIn($key, Link::query()->withSource($this->model)->where('target_type', $other->getMorphClass())->select('target_id'))
            ->orWhereIn($key, Link::query()->withTarget($this->model)->where('source_type', $other->getMorphClass())->select('source_id')));
    }
}
