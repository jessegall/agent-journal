<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Sessions\DriverBuildsApproved;
use App\Models\Support\JournalModel;
use App\Values\DriverKey;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $driver_key
 * @property list<string> $build_pins
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class DriverApproval extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     *
     * @column build_pins list<string>
     */
    protected function casts(): array
    {
        return ['build_pins' => 'array'];
    }

    // ----------[ Constructors ]----------

    /**
     * The driver's approval, or a new one not yet saved when the owner never approved it.
     */
    public static function create(DriverKey $key): self
    {
        $existing = self::findOfKey($key);

        if ($existing !== null) {
            return $existing;
        }

        $approval = new self();
        $approval->driver_key = (string) $key;

        return $approval;
    }

    // ----------[ Mutations ]----------

    /**
     * Approves the driver with these builds, replacing any builds approved before.
     *
     * @param  list<string>  $pins
     */
    public function approveBuilds(array $pins): void
    {
        $this->build_pins = $pins;
        $this->saveAndAssert();
        $this->raise(new DriverBuildsApproved($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The approved builds of each approved driver among these keys, by key.
     *
     * @param  list<string>  $keys
     * @return array<string, list<string>>
     */
    public static function resolveBuildsByKey(array $keys): array
    {
        return self::query()
            ->ofKeys($keys)
            ->readExactly(count($keys))
            ->get()
            ->mapWithKeys(fn (self $approval) => [$approval->driver_key => $approval->build_pins])
            ->all();
    }

    /**
     * The driver's approval; none before its first.
     */
    public static function findOfKey(DriverKey $key): self|null
    {
        return self::query()->ofKeys([(string) $key])->first();
    }

    // ----------[ Scopes ]----------

    /**
     * The approvals of the driver keys.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $keys
     */
    #[Scope]
    protected function ofKeys(Builder $query, array $keys): void
    {
        $query->whereIn('driver_key', $keys);
    }
}
