<?php

declare(strict_types=1);

namespace App\Sharing\Casts;

use App\Sharing\Data\StoredGatewaySettings;
use App\Sharing\Exceptions\StoredShareColumnInvalid;
use App\Sharing\Support\GatewaySettings;
use Error;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * Reads the JSON settings column of a gateway configuration as GatewaySettings and writes them back.
 *
 * @implements CastsAttributes<GatewaySettings, GatewaySettings>
 */
final class GatewaySettingsCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     *
     * @throws StoredShareColumnInvalid
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): GatewaySettings
    {
        try {
            return StoredGatewaySettings::from(json_decode((string) $value, true, 4, JSON_THROW_ON_ERROR))->settings();
        } catch (JsonException|CannotCreateData|Error $failure) {
            throw StoredShareColumnInvalid::for($model->getTable(), $key, (string) $model->getKey(), $failure);
        }
    }

    /**
     * @param  GatewaySettings  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        return [$key => json_encode($value, JSON_THROW_ON_ERROR)];
    }
}
