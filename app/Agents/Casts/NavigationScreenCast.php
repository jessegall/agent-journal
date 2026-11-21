<?php

declare(strict_types=1);

namespace App\Agents\Casts;

use App\Agents\Data\StoredNavigationScreen;
use App\Agents\Values\NavigationScreen;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * @implements CastsAttributes<NavigationScreen, NavigationScreen>
 */
final class NavigationScreenCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): NavigationScreen
    {
        return StoredNavigationScreen::from(json_decode((string) $value, true, flags: JSON_THROW_ON_ERROR))->screen();
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return json_encode($value->toArray(), JSON_THROW_ON_ERROR);
    }
}
