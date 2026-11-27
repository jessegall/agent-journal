<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Sessions\SessionProcess;
use App\Models\Support\JournalModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;

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
final class HostDriverImageWait extends JournalModel implements EventSource
{
    use BoundedReads;
    use RaisesEvents;

    public const null UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'created_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The start's wait for the image, which the caller registers holding the image row's lock; a start already
     * waiting cannot wait a second time.
     */
    public static function for(HostDriverImage $image, SessionProcess $start): self
    {
        $wait = new self();
        $wait->host_driver_image_id = $image->id;
        $wait->session_process_id = $start->id;
        $wait->saveAndAssert();

        return $wait;
    }

    // ----------[ Changes ]----------

    /**
     * The wait is served: it goes with the outcome it waited for.
     */
    public function consume(): void
    {
        $this->deleteAndAssert();
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
}
