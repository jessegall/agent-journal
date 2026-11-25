<?php

declare(strict_types=1);

namespace Domain\Reminders\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Models\Concerns\FindsForUpdate;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Reminders\Enums\ReminderStatus;
use Domain\Reminders\Events\ReminderFinished;
use Domain\Reminders\Exceptions\ReminderEnded;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Something its actor means to do at one time: a title, the moment it is due and whether it still waits.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $title
 * @property CarbonImmutable $due_at
 * @property ReminderStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'due_at',
    'status',
])]
final class Reminder extends Model implements EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use FindsForUpdate;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The record type a reminder is linked and found under.
     */
    public const string LINK_TYPE = 'reminders.reminder';

    /**
     * The most characters a reminder's title holds.
     */
    public const int TITLE_CHARACTER_LIMIT = 255;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'due_at' => 'immutable_datetime',
            'status' => ReminderStatus::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new open reminder for its owner, due at that moment.
     */
    public static function create(ActorIdentity $owner, string $title, CarbonImmutable $dueAt): self
    {
        $reminder = new self();
        $reminder->title = $title;
        $reminder->due_at = $dueAt;
        $reminder->status = ReminderStatus::Open;
        $reminder->belongTo($owner);
        $reminder->save();

        return $reminder;
    }

    // ----------[ Mutations ]----------

    /**
     * Marks an open reminder done; one already done or cancelled is refused.
     *
     * @throws ReminderEnded
     */
    public function finish(): void
    {
        $this->assertWaiting();

        $this->status = ReminderStatus::Done;
        $this->assertSaved($this->save());
        $this->raise(new ReminderFinished($this->id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses to finish a reminder that already ended.
     *
     * @throws ReminderEnded
     */
    private function assertWaiting(): void
    {
        if (! $this->status->isWaiting()) {
            throw ReminderEnded::as($this->id, $this->status);
        }
    }

    // ----------[ Queries ]----------

    /**
     * Open reminders first, each group by the moment it is due.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inDueOrder(Builder $query): void
    {
        $query->orderByRaw('case when status = ? then 0 else 1 end', [ReminderStatus::Open->value])
            ->orderBy('due_at')
            ->orderBy('id');
    }
}
