<?php

declare(strict_types=1);

namespace App\Models\Sharing;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Sharing\ShareInstallationHeld;
use App\Exceptions\GatewayRunStale;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The one row of the installation's sharing: whose supervisor run holds the gateways and until when. Every admission
 * and state change of a share locks it first, so the share limits are counted one writer at a time.
 *
 * @property string $id
 * @property string $name
 * @property string|null $run_id
 * @property CarbonImmutable|null $run_lease_ends_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'run_id',
    'run_lease_ends_at',
])]
final class ShareInstallation extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    private const string NAME = 'installation';

    /**
     * How long a supervisor run holds the gateways after its last claim, outcome or health report.
     */
    private const int RUN_LEASE_SECONDS = 90;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'run_lease_ends_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The installation row, locked until the transaction ends. It is made by an insert that does nothing when it
     * exists, so two first writers never abort each other.
     */
    public static function create(): self
    {
        $installation = new self();
        $installation->setRawAttributes([
            'id' => $installation->newUniqueId(),
            'name' => self::NAME,
        ]);
        $installation->insertIfAbsent();

        return self::query()->named(self::NAME)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * Holds the gateways for the supervisor run: a run newer than the holder takes them over, the holder renews its
     * lease, and an older run is refused. Run ids are ULIDs, so a later start sorts after an earlier one. Returns
     * whether the run took them over just now.
     *
     * @throws GatewayRunStale
     */
    public function holdFor(string $runId): bool
    {
        $this->assertRunNotStale($runId);

        $takesOver = $this->run_id !== $runId;
        $this->run_id = $runId;
        $this->run_lease_ends_at = CarbonImmutable::now()->addSeconds(self::RUN_LEASE_SECONDS);
        $this->assertSaved($this->save());
        $this->raise(new ShareInstallationHeld($this->id, $runId));

        return $takesOver;
    }

    // ----------[ Predicates ]----------

    public function isCurrentRun(string $runId): bool
    {
        return $this->run_id === $runId;
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a run older than the one that holds the installation.
     *
     * @throws GatewayRunStale
     */
    private function assertRunNotStale(string $runId): void
    {
        if ($this->run_id !== null && strcmp($runId, $this->run_id) < 0) {
            throw GatewayRunStale::for($runId);
        }
    }

    // ----------[ Queries ]----------

    /**
     * Whether a sharing supervisor holds the gateways now: its lease was renewed within the last 90 seconds.
     */
    public static function hasLiveRun(): bool
    {
        return self::query()->named(self::NAME)->leasedNow()->exists();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function named(Builder $query, string $name): void
    {
        $query->where('name', $name);
    }

    /**
     * The installation while a run holds an unexpired lease on it.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function leasedNow(Builder $query): void
    {
        $query->whereNotNull('run_id')->where('run_lease_ends_at', '>', CarbonImmutable::now());
    }
}
