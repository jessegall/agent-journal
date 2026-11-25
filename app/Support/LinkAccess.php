<?php

declare(strict_types=1);

namespace App\Support;

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
        return LinkedRecords::narrow($visibleModels, $this->model->getMorphClass(), (string) $this->model->getKey());
    }
}
