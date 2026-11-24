<?php

declare(strict_types=1);

namespace App\Casts;

use App\Data\Asks\StoredSupervisorRoutes;
use App\Values\SupervisorRoutes;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * @implements CastsAttributes<SupervisorRoutes, SupervisorRoutes>
 */
final class SupervisorRoutesCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): SupervisorRoutes
    {
        return StoredSupervisorRoutes::from(json_decode((string) $value, true, flags: JSON_THROW_ON_ERROR))->routes;
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR);
    }
}
