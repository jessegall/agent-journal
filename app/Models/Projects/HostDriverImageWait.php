<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\DriverImageWaitServed;
use App\Models\Sessions\SessionProcess;
use App\Models\Support\HasUlidKey;
use App\Records\Concerns\CountsPivotLoads;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * A start that waits for its host's driver image: one per start, registered under the image row's lock, and gone in
 * the same transaction as the outcome it served.
 *
 * @property string $id
 * @property string $host_driver_image_id
 * @property string $session_process_id
 * @property CarbonImmutable $created_at
 */
#[Table('host_driver_image_waits')]
final class HostDriverImageWait extends Pivot implements EventSource, ReadableModel
{
    use BoundedReads;
    use CountsPivotLoads;
    use HasUlidKey;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    public const null UPDATED_AT = null;

    /**
     * A pivot opens every attribute by default; this one stays closed, as every model writes its columns as properties.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

    // ----------[ Constructors ]----------

    /**
     * The start's wait for the image, which the caller registers holding the image row's lock; a start already
     * waiting cannot wait a second time.
     */
    public static function create(HostDriverImage $image, SessionProcess $start): self
    {
        $wait = new self();
        $wait->host_driver_image_id = $image->id;
        $wait->session_process_id = $start->id;
        $wait->saveAndAssert();

        return $wait;
    }

    // ----------[ Mutations ]----------

    /**
     * The wait is served: it goes with the outcome it waited for.
     */
    public function consume(): void
    {
        $this->deleteAndAssert();
        $this->raise(new DriverImageWaitServed($this->host_driver_image_id, $this->session_process_id));
    }

    // ----------[ Queries ]----------

    /**
     * The start's wait; none for a start that waits for no image.
     */
    public static function findOfStart(string $startId): self|null
    {
        return self::query()->ofStarts([$startId])->first();
    }

    /**
     * Whether the start waits for its host's driver image.
     */
    public static function hasOfStart(string $startId): bool
    {
        return self::query()->ofStarts([$startId])->exists();
    }

    /**
     * The waits of the session's starts, locked.
     *
     * @return list<self>
     */
    public static function findLockedOfSession(string $sessionId): array
    {
        $starts = SessionProcess::query()->supervised()->ofSessions([$sessionId])->ids();

        return array_values(self::query()->ofStarts($starts)->lockForUpdate()->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * The waits on the image.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function of(Builder $query, HostDriverImage $image): void
    {
        $query->where('host_driver_image_id', $image->id);
    }

    /**
     * The waits of the starts.
     *
     * @param  Builder<self>  $query
     * @param  list<string>|Builder<SessionProcess>  $starts
     */
    #[Scope]
    protected function ofStarts(Builder $query, array|Builder $starts): void
    {
        $query->whereIn('session_process_id', $starts);
    }
}
