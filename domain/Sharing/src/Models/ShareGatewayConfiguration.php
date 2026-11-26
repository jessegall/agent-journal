<?php

declare(strict_types=1);

namespace Domain\Sharing\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Domain\Sharing\Events\ShareGatewayChanged;
use Domain\Sharing\Events\ShareGatewayMadeDefault;
use Domain\Sharing\Exceptions\ShareGatewayUnavailable;
use Domain\Sharing\Support\Gateways\GatewayConfiguration;
use Domain\Sharing\Support\Gateways\GatewaySettings;
use Domain\Sharing\Support\SourceAddressRule;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $gateway_key
 * @property int $configuration_version
 * @property GatewaySettings $settings
 * @property bool $is_default
 * @property CarbonImmutable|null $disabled_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $source_address_rule
 * @property-read mixed $to_configuration
 *
 * @mixin \Eloquent
 */
final class ShareGatewayConfiguration extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'configuration_version' => 'integer',
            'settings' => GatewaySettings::class,
            'is_default' => 'boolean',
            'disabled_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The gateway's next settings revision, numbered after every earlier one and not yet the default; earlier
     * revisions stay for the shares that pin them. A command calls it under the installation lock, so two revisions
     * never take one number.
     */
    public static function create(GatewaySettings $settings): self
    {
        $configuration = new self();
        $configuration->gateway_key = $settings->gatewayKey;
        $configuration->configuration_version = self::resolveNextVersion($settings->gatewayKey);
        $configuration->settings = $settings;
        $configuration->is_default = false;
        $configuration->saveAndAssert();
        $configuration->raise($configuration->changedEvent());

        return $configuration;
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
        $this->saveAndAssert();
        $this->raise($this->changedEvent());
    }

    /**
     * Makes this revision the one new shares use when the owner names none; the caller first ends every other default.
     */
    public function makeDefault(): void
    {
        $this->is_default = true;
        $this->save();
        $this->raise(new ShareGatewayMadeDefault($this->id));
    }

    // ----------[ Predicates ]----------

    public function isDisabled(): bool
    {
        return $this->disabled_at !== null;
    }

    // ----------[ Transformers ]----------

    /**
     * Whether the newest running endpoint of this revision answers; null while none runs.
     */
    public function endpointHealth(): bool|null
    {
        return ShareGatewayEndpoint::findNewestRunningOf($this)
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
        return Share::findUnendedOf($this->id);
    }

    // ----------[ Calculations ]----------

    /**
     * The public address a share's token opens under this configuration.
     */
    public function shareUrl(string $token): string
    {
        return rtrim($this->settings->publicOrigin, '/').'/s/'.$token;
    }

    // ----------[ Accessors ]----------

    /**
     * How this gateway's forwarded requests name the visitor: none until a gateway's fixture proves the header it
     * overwrites.
     *
     * @return Attribute<SourceAddressRule, never>
     */
    protected function sourceAddressRule(): Attribute
    {
        return Accessor::get(fn () => SourceAddressRule::none());
    }

    /**
     * @return Attribute<GatewayConfiguration, never>
     */
    protected function toConfiguration(): Attribute
    {
        return Accessor::get(
            fn () => new GatewayConfiguration($this->id, $this->configuration_version, $this->settings),
        );
    }

    // ----------[ Queries ]----------

    /**
     * The enabled configuration of this id.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function findUsable(string $configurationId): self
    {
        return self::query()
            ->enabled()
            ->whereKey($configurationId)
            ->firstOr(ShareGatewayUnavailable::throwing()->forConfiguration($configurationId));
    }

    /**
     * The enabled configuration of this id, locked until the transaction ends.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function findLockedUsable(string $configurationId): self
    {
        return self::query()
            ->enabled()
            ->whereKey($configurationId)
            ->lockForUpdate()
            ->firstOr(ShareGatewayUnavailable::throwing()->forConfiguration($configurationId));
    }

    /**
     * The configurations of these ids, locked together in id order, so two runs take their locks in the same order.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function findLockedAllById(array $ids): array
    {
        return array_values(self::query()
            ->whereKey($ids)
            ->oldestFirst()
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
    public static function findAllRevisions(): array
    {
        return array_values(
            self::query()->newestFirst()
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
    public static function resolveGatewayKeysOf(array $ids): array
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
    public static function findUsableDefault(): self
    {
        return self::query()->enabled()->markedDefault()->firstOr(ShareGatewayUnavailable::throwing()->noDefault());
    }

    /**
     * The version the gateway's next configuration takes: one past its newest.
     */
    public static function resolveNextVersion(string $gatewayKey): int
    {
        return (int) self::query()->forGateway($gatewayKey)->max('configuration_version') + 1;
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
