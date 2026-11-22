<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Contracts\Actors\CurrentUserResolver;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits a Web model to the rows of the user signed in to this request; a request with no signed-in user sees none.
 * It asks for the user on every query, so a worker that serves many requests never keeps an earlier request's user.
 *
 * @implements Scope<Model>
 */
final readonly class CurrentUserScope implements Scope
{
    /**
     * @param  Closure(): CurrentUserResolver  $users
     */
    public function __construct(private Closure $users) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = ($this->users)()->currentUser();

        if ($user->isEmpty()) {
            $builder->whereRaw('1 = 0');

            return;
        }

        $builder->where($model->qualifyColumn('user_id'), $user->get()->id);
    }
}
