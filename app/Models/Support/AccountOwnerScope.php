<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\AccessType;
use App\Models\Accounts\Account;
use App\Policies\AccountPolicy;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits the account records to an actor granted the account read, which only the owner holds: an agent, the system
 * or a request with nobody acting sees none. It asks on every query, so a worker that serves many requests never
 * keeps an earlier request's actor.
 *
 * @implements Scope<Model>
 */
final readonly class AccountOwnerScope implements Scope
{
    /**
     * @param  Closure(): CurrentActor  $actors
     * @param  Closure(): CurrentAuthorizer  $authorizer
     */
    public function __construct(private Closure $actors, private Closure $authorizer) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (! ($this->actors)()->hasActor() || ! $this->mayRead()) {
            $builder->whereKey([]);
        }
    }

    private function mayRead(): bool
    {
        $granted = ($this->authorizer)()->filterActions(AccountPolicy::class, Account::class, [AccessType::Read]);

        return $granted !== [];
    }
}
