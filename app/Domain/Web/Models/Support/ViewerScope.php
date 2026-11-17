<?php

declare(strict_types=1);

namespace App\Domain\Web\Models\Support;

use App\Domain\Access\Contracts\ViewerReader;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits a Web model to the rows of the user signed in to this request; a request with no signed-in user sees none.
 * It asks for the viewer on every query, so a worker that serves many requests never keeps an earlier request's user.
 *
 * @implements Scope<Model>
 */
final readonly class ViewerScope implements Scope
{
    /**
     * @param  Closure(): ViewerReader  $viewers
     */
    public function __construct(private Closure $viewers) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        $viewer = ($this->viewers)()->viewer();

        if ($viewer === null) {
            $builder->whereRaw('1 = 0');

            return;
        }

        $builder->where($model->qualifyColumn('user_id'), $viewer->id);
    }
}
