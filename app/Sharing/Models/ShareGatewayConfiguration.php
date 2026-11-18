<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Casts\GatewaySettingsCast;
use App\Sharing\Exceptions\ShareGatewayUnavailable;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\SourceAddressRule;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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

    /**
     * The enabled configuration of this id.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function usable(string $configurationId): self
    {
        return self::query()->enabled()->whereKey($configurationId)->first() ?? throw ShareGatewayUnavailable::forConfiguration($configurationId);
    }

    /**
     * The enabled configuration of this id, locked until the transaction ends.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function lockUsable(string $configurationId): self
    {
        return self::query()->enabled()->whereKey($configurationId)->lockForUpdate()->first() ?? throw ShareGatewayUnavailable::forConfiguration($configurationId);
    }

    /**
     * The gateway key of each of these configurations, by configuration id.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function gatewayKeysOf(array $ids): array
    {
        return array_map(strval(...), self::query()->whereKey($ids)->readLimit(max(1, count($ids)))->pluck('gateway_key', 'id')->all());
    }

    /**
     * The enabled configuration the owner made the default.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function usableDefault(): self
    {
        return self::query()->enabled()->markedDefault()->first() ?? throw ShareGatewayUnavailable::noDefault();
    }

    /**
     * How this gateway's forwarded requests name the visitor: none until a gateway's fixture proves the header it
     * overwrites.
     */
    public function sourceAddressRule(): SourceAddressRule
    {
        return SourceAddressRule::none();
    }

    /**
     * The public address a share's token opens under this configuration.
     */
    public function shareUrl(string $token): string
    {
        return rtrim($this->settings->publicOrigin, '/').'/s/'.$token;
    }

    public function toConfiguration(): GatewayConfiguration
    {
        return new GatewayConfiguration($this->id, $this->configuration_version, $this->settings);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function enabled(Builder $query): void
    {
        $query->whereNull('disabled_at');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function markedDefault(Builder $query): void
    {
        $query->where('is_default', true);
    }
}
