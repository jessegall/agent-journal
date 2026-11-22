<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Values\DriverKey;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The owner approved a third-party driver registration, and the builds of it a host may run; a host enrolls such a
 * driver only once it is approved and runs one of these builds.
 *
 * @property string $id
 * @property string $driver_key
 * @property list<string> $build_pins
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['driver_key', 'build_pins'])]
final class DriverApproval extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['build_pins' => 'array'];
    }

    /**
     * The driver's approval, or a new one not yet saved when the owner never approved it.
     */
    public static function forKey(DriverKey $key): self
    {
        return self::query()->firstOrNew(['driver_key' => (string) $key]);
    }

    // ----------[ Mutations ]----------

    /**
     * Approves the driver with these builds, replacing any builds approved before.
     *
     * @param  list<string>  $buildPins
     */
    public function approveBuilds(array $buildPins): void
    {
        $this->build_pins = $buildPins;
        $this->save();
    }

    // ----------[ Queries ]----------

    /**
     * The approved builds of each approved driver among these keys, by key.
     *
     * @param  list<string>  $keys
     * @return array<string, list<string>>
     */
    public static function buildsByKey(array $keys): array
    {
        return self::query()
            ->whereIn('driver_key', $keys)
            ->readExactly(count($keys))
            ->get()
            ->mapWithKeys(fn (self $approval) => [$approval->driver_key => $approval->build_pins])
            ->all();
    }
}
