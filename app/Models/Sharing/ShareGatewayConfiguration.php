<?php

declare(strict_types=1);

namespace App\Models\Sharing;

use App\Casts\GatewaySettingsCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Sharing\ShareGatewayChanged;
use App\Events\Sharing\ShareGatewayMadeDefault;
use App\Exceptions\ShareGatewayUnavailable;
use App\Support\GatewayConfiguration;
use App\Support\GatewaySettings;
use App\Support\SourceAddressRule;
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
#[Fillable([
    'gateway_key',
    'configuration_version',
    'settings',
    'is_default',
    'disabled_at',
])]
final class ShareGatewayConfiguration extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
            'settings' => GatewaySettingsCast::class,
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

    public function toConfiguration(): GatewayConfiguration
    {
        return new GatewayConfiguration($this->id, $this->configuration_version, $this->settings);
    }

    // ----------[ Calculations ]----------

    /**
     * The public address a share's token opens under this configuration.
     */
    public function shareUrl(string $token): string
    {
        return rtrim($this->settings->publicOrigin, '/').'/s/'.$token;
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a configuration that is not there or not enabled.
     *
     * @phpstan-assert self $row
     *
     * @throws ShareGatewayUnavailable
     */
    private static function assertUsable(self|null $row, string $configurationId): void
    {
        if ($row === null) {
            throw ShareGatewayUnavailable::forConfiguration($configurationId);
        }
    }

    /**
     * Refuses an installation with no enabled default gateway.
     *
     * @phpstan-assert self $row
     *
     * @throws ShareGatewayUnavailable
     */
    private static function assertDefaultFound(self|null $row): void
    {
        if ($row === null) {
            throw ShareGatewayUnavailable::noDefault();
        }
    }

    // ----------[ Queries ]----------

    /**
     * The enabled configuration of this id.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function usable(string $configurationId): self
    {
        $row = self::query()->enabled()->whereKey($configurationId)->first();
        self::assertUsable($row, $configurationId);

        return $row;
    }

    /**
     * The enabled configuration of this id, locked until the transaction ends.
     *
     * @throws ShareGatewayUnavailable
     */
    public static function lockUsable(string $configurationId): self
    {
        $row = self::query()->enabled()->whereKey($configurationId)->lockForUpdate()->first();
        self::assertUsable($row, $configurationId);

        return $row;
    }

    /**
     * The configuration of this id, enabled or not, locked until the transaction ends.
     */
    public static function lockById(string $configurationId): self
    {
        return self::lockedById($configurationId);
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
    public static function allRevisions(): array
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
        $row = self::query()->enabled()->markedDefault()->first();
        self::assertDefaultFound($row);

        return $row;
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
