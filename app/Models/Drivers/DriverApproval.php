<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Sessions\DriverBuildsApproved;
use App\Values\DriverKey;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $driver_key
 * @property array $build_pins
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class DriverApproval extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['build_pins' => 'array'];
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
        $this->assertSaved($this->save());
        $this->raise(new DriverBuildsApproved($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The driver's approval, or a new one not yet saved when the owner never approved it.
     */
    public static function forKey(DriverKey $key): self
    {
        $existing = self::query()->where('driver_key', (string) $key)->first();

        if ($existing !== null) {
            return $existing;
        }

        $approval = new self();
        $approval->driver_key = (string) $key;

        return $approval;
    }

    /**
     * The approved builds of each approved driver among these keys, by key.
     *
     * @param  list<string>  $keys
     * @return array<string, list<string>>
     */
    public static function buildsByKey(array $keys): array
    {
        return self::query()
            ->ofKeys($keys)
            ->readExactly(count($keys))
            ->get()
            ->mapWithKeys(fn (self $approval) => [$approval->driver_key => $approval->build_pins])
            ->all();
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
