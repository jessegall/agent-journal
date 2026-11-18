<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Casts\GatewaySettingsCast;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewaySettings;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The owner's settings for one gateway, kept as numbered revisions: a share pins the version it was made under, so a
 * change of settings reaches only new shares.
 *
 * @property string $id
 * @property string $gateway_key
 * @property int $configuration_version
 * @property GatewaySettings $settings
 * @property bool $is_default
 * @property CarbonImmutable|null $disabled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['gateway_key', 'configuration_version', 'settings', 'is_default', 'disabled_at'])]
final class ShareGatewayConfiguration extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.share-gateway-configuration';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'configuration_version' => 'integer',
            'settings' => GatewaySettingsCast::class,
            'is_default' => 'boolean',
            'disabled_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new configuration at its first version, not yet the default.
     */
    public static function configure(GatewaySettings $settings): self
    {
        $configuration = new self;
        $configuration->gateway_key = $settings->gatewayKey;
        $configuration->configuration_version = 1;
        $configuration->settings = $settings;
        $configuration->is_default = false;
        $configuration->save();

        return $configuration;
    }

    public function toConfiguration(): GatewayConfiguration
    {
        return new GatewayConfiguration($this->id, $this->configuration_version, $this->settings);
    }
}
