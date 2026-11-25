<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Events\HelperNoticeDelivered;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * What a parent is told when a helper's attempt at a job ended: the job, where it stands and what to run next. It is
 * kept for the parent actor, never for a session.
 *
 * @property string $id
 * @property string $helper_identity_id
 * @property string $helper_job_id
 * @property JobState $job_state
 * @property string $text
 * @property CarbonImmutable|null $delivered_at
 */
#[Table('helper_notices')]
#[Fillable(['job_state', 'text'])]
final class HelperNotice extends Model implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The most notices given to a parent at one context start.
     */
    public const int DELIVERED_LIMIT = 20;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['job_state' => JobState::class, 'delivered_at' => 'immutable_datetime'];
    }

    // ----------[ Constructors ]----------

    public static function create(HelperJob $job, string $text): self
    {
        $notice = new self();
        $notice->helper_identity_id = $job->helper_identity_id;
        $notice->helper_job_id = $job->id;
        $notice->job_state = $job->state;
        $notice->text = $text;
        $notice->belongTo($job->actor());
        $notice->save();

        return $notice;
    }

    // ----------[ Mutations ]----------

    public function markDelivered(): void
    {
        $this->delivered_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new HelperNoticeDelivered($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The notices of this parent not yet given to it, oldest first, locked so each is given once.
     *
     * @return list<self>
     */
    public static function undeliveredFor(ActorIdentity $parent): array
    {
        return array_values(self::query()
            ->ownedBy($parent)
            ->whereNull('delivered_at')
            ->orderBy('id')
            ->lockForUpdate()
            ->limit(self::DELIVERED_LIMIT)
            ->get()
            ->all());
    }
}
