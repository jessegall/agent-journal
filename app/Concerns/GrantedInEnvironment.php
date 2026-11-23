<?php

declare(strict_types=1);

namespace App\Concerns;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * Grants kept per environment under an environment key, the local journal's being LOCAL_ENVIRONMENT, until revoked.
 */
trait GrantedInEnvironment
{
    /**
     * The active grants of an environment.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function inEnvironment(Builder $query, string|null $environmentId): void
    {
        $query->where('environment_key', $environmentId ?? self::LOCAL_ENVIRONMENT)->whereNull('revoked_at');
    }
}
