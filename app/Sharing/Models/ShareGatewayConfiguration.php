<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Casts\GatewaySettingsCast;
use App\Sharing\Events\ShareGatewayChanged;
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
final class ShareGatewayConfiguration extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'core.share-gateway-configuration';

    // ----------[ Constructors ]----------

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
     * The gateway's next settings revision, numbered after every earlier one and not yet the default; earlier
     * revisions stay for the shares that pin them. A command calls it under the installation lock, so two revisions
     * never take one number.
     */
    public static function create(GatewaySettings $settings): self
    {
        $latest = self::query()->forGateway($settings->gatewayKey)->max('configuration_version');
        $configuration = new self();
        $configuration->gateway_key = $settings->gatewayKey;
        $configuration->configuration_version = (is_numeric($latest) ? (int) $latest : 0) + 1;
        $configuration->settings = $settings;
        $configuration->is_default = false;
        $configuration->assertSaved($configuration->save());
        $configuration->raise($configuration->changedEvent());

        return $configuration;
    }

    // ----------[ Queries ]----------

    /**
     * The enabled configuration of this id.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function usable(string $configurationId): self
    {
        return self::query()->enabled()->whereKey($configurationId)->firstOr(
            fn () => throw ShareGatewayUnavailable::forConfiguration($configurationId),
        );
    }

    /**
     * The enabled configuration of this id, locked until the transaction ends.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function lockUsable(string $configurationId): self
    {
        return self::query()->enabled()->whereKey($configurationId)->lockForUpdate()->firstOr(
            fn () => throw ShareGatewayUnavailable::forConfiguration($configurationId),
        );
    }

    /**
     * The configuration of this id, enabled or not, locked until the transaction ends.
     */
    public static function lockById(string $configurationId): self
    {
        return self::query()->whereKey($configurationId)->lockForUpdate()->firstOrFail();
    }

    /**
     * The configurations of these ids, locked together in id order, so two runs take their locks in the same order.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function lockAllById(array $ids): array
    {
        return array_values(self::query()
            ->whereKey($ids)
            ->orderBy('id')
            ->lockForUpdate()
            ->readExactly(count($ids))
            ->get()
            ->all());
    }

    /**
     * Every gateway revision, newest first, for the owner's gateway settings.
     *
     * @return list<self>
     */
    public static function allRevisions(): array
    {
        return array_values(
            self::query()->orderByDesc('id')
                ->readAll('an installation keeps a handful of gateway revisions')
                ->get()
                ->all(),
        );
    }

    /**
     * The gateway key of each of these configurations, by configuration id.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function gatewayKeysOf(array $ids): array
    {
        return array_map(
            strval(...),
            self::query()->whereKey($ids)->readExactly(max(1, count($ids)))->pluck('gateway_key', 'id')->all(),
        );
    }

    /**
     * The enabled configuration the owner made the default.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function usableDefault(): self
    {
        return self::query()->enabled()->markedDefault()->firstOr(fn () => throw ShareGatewayUnavailable::noDefault());
    }

    // ----------[ Mutations ]----------

    /**
     * Takes the gateway out of use: no new share or preview uses it, and it is no longer the default. The provider's
     * account and domain are left as they are.
     */
    public function disable(): void
    {
        $this->disabled_at = CarbonImmutable::now();
        $this->is_default = false;
        $this->assertSaved($this->save());
        $this->raise($this->changedEvent());
    }

    /**
     * Makes this revision the one new shares use when the owner names none; the caller first ends every other default.
     */
    public function makeDefault(): void
    {
        $this->is_default = true;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function isDisabled(): bool
    {
        return $this->disabled_at !== null;
    }

    /**
     * Whether the newest running endpoint of this revision answers; null while none runs.
     */
    public function endpointHealth(): bool|null
    {
        return ShareGatewayEndpoint::newestRunningOf($this)
            ->map(fn (ShareGatewayEndpoint $endpoint) => $endpoint->isHealthy())
            ->getOrElse(null);
    }

    /**
     * The shares this revision's gateway serves that have not ended, which disabling it would revoke.
     *
     * @return list<Share>
     */
    public function unendedShares(): array
    {
        return Share::unendedOf($this->id);
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

    // ----------[ Scopes ]----------

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
    protected function forGateway(Builder $query, string $gatewayKey): void
    {
        $query->where('gateway_key', $gatewayKey);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function markedDefault(Builder $query): void
    {
        $query->where('is_default', true);
    }

    /**
     * The event that tells this revision was configured or disabled.
     */
    private function changedEvent(): ShareGatewayChanged
    {
        return new ShareGatewayChanged(
            $this->id,
            $this->configuration_version,
            $this->isDisabled(),
            CarbonImmutable::now(),
        );
    }
}
