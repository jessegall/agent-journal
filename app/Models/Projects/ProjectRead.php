<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Connections\Data\ProjectEntryData;
use App\Contracts\Events\EventSource;
use App\Events\Connections\ProjectReadAnsweredWithEntries;
use App\Events\Connections\ProjectReadAnsweredWithText;
use App\Events\Connections\ProjectReadClaimed;
use App\Events\Connections\ProjectReadFailed;
use App\Models\Support\HasActorColumns;
use App\Models\Support\JournalModel;
use App\Projects\Enums\ProjectReadFailure;
use App\Projects\Enums\ProjectReadStatus;
use App\Projects\Enums\ProjectReadType;
use App\Projects\Exceptions\ProjectReadRefused;
use App\Projects\Values\ProjectFileText;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use PhpOption\Option;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $binding_id
 * @property ProjectReadType $type
 * @property string $path
 * @property string $actor_type
 * @property string $actor_id
 * @property ProjectReadStatus $status
 * @property ProjectReadFailure|null $failure
 * @property DataCollection<int, ProjectEntryData>|null $entries
 * @property string|null $text
 * @property-read ProjectBinding $binding
 * @property string|null $digest
 * @property int|null $size
 * @property bool $is_truncated
 * @property CarbonImmutable|null $claimed_at
 * @property CarbonImmutable|null $answered_at
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
#[Table('project_reads')]
final class ProjectRead extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * The most entries one folder answer holds.
     */
    public const int DIRECTORY_ENTRY_LIMIT = 500;

    /**
     * The most bytes of text one file answer holds.
     */
    public const int FILE_TEXT_BYTE_LIMIT = 262144;

    /**
     * The longest a read waits for its host, in seconds, before it expires.
     */
    public const int PENDING_SECONDS_LIMIT = 15;

    /**
     * The longest a settled read is kept, in minutes, to answer the same question again.
     */
    public const int KEEP_MINUTES_LIMIT = 10;

    /**
     * The longest a path relative to the project's root may be.
     */
    public const int PATH_CHARACTER_LIMIT = 1024;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ProjectReadType::class,
            'status' => ProjectReadStatus::class,
            'failure' => ProjectReadFailure::class,
            'entries' => DataCollection::class.':'.ProjectEntryData::class,
            'size' => 'integer',
            'is_truncated' => 'boolean',
            'claimed_at' => 'immutable_datetime',
            'answered_at' => 'immutable_datetime',
            'expires_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new read of a folder or a file of the binding's project, waiting for its host.
     */
    public static function create(
        ProjectBinding $binding,
        ProjectReadType $type,
        string $path,
        ActorReference $requester,
    ): self {
        $read = new self();
        $read->binding_id = $binding->id;
        $read->type = $type;
        $read->path = $path;
        $read->actor_type = $requester->type;
        $read->actor_id = $requester->id;
        $read->status = ProjectReadStatus::Pending;
        $read->is_truncated = false;
        $read->expires_at = CarbonImmutable::now()->addSeconds(self::PENDING_SECONDS_LIMIT);
        $read->save();

        return $read;
    }

    // ----------[ Mutations ]----------

    /**
     * Marks the read handed out to its host, so a second poll does not hand it out again.
     */
    public function markClaimed(CarbonImmutable $now): void
    {
        $this->claimed_at = $now;
        $this->saveAndAssert();
        $this->raise(new ProjectReadClaimed($this->id));
    }

    /**
     * Answers a folder read with its entries, cut to the entry limit and marked cut when the host or the limit cut it.
     *
     * @param  list<ProjectEntryData>  $entries
     */
    public function answerWithEntries(array $entries, bool $isTruncated): void
    {
        $kept = array_slice($entries, 0, self::DIRECTORY_ENTRY_LIMIT);
        $this->entries = ProjectEntryData::collect($kept, DataCollection::class);

        $this->is_truncated = $isTruncated || count($entries) > self::DIRECTORY_ENTRY_LIMIT;
        $this->settle(ProjectReadStatus::Answered);
        $this->raise(new ProjectReadAnsweredWithEntries($this->id));
    }

    /**
     * Answers a file read with its text, the digest and size of the whole file, and whether the text was cut.
     */
    public function answerWithText(ProjectFileText $text, bool $isTruncated): void
    {
        $this->text = $text->text;
        $this->digest = $text->digest;
        $this->size = $text->size;
        $this->is_truncated = $isTruncated;
        $this->settle(ProjectReadStatus::Answered);
        $this->raise(new ProjectReadAnsweredWithText($this->id));
    }

    public function fail(ProjectReadFailure $failure): void
    {
        $this->failure = $failure;
        $this->settle(ProjectReadStatus::Failed);
        $this->raise(new ProjectReadFailed($this->id, $failure));
    }

    // ----------[ Predicates ]----------

    public function isSettled(): bool
    {
        return $this->status->isSettled();
    }

    public function isExpired(): bool
    {
        return $this->status === ProjectReadStatus::Expired;
    }

    /**
     * Whether the read is of a project this host runs.
     */
    public function isOfHost(string $hostId): bool
    {
        return ProjectBinding::query()->whereKey($this->binding_id)->onHost($hostId)->exists();
    }

    // ----------[ Transformers ]----------

    /**
     * The folder's entries as the host listed them; none for a file or an unanswered read.
     *
     * @return list<ProjectEntryData>
     */
    public function listedEntries(): array
    {
        return $this->entries?->items() ?? [];
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<ProjectBinding, $this>
     */
    public function binding(): BelongsTo
    {
        return $this->belongsTo(ProjectBinding::class);
    }

    // ----------[ Internals ]----------

    private function settle(ProjectReadStatus $status): void
    {
        $this->status = $status;
        $this->answered_at = CarbonImmutable::now();
        $this->save();
    }

    // ----------[ Queries ]----------

    /**
     * The reads of this host's bindings no poll handed out yet and still in time, oldest first, locked so a poll beside
     * this one skips them.
     *
     * @return list<self>
     */
    public static function findClaimableFor(string $hostId, int $limit, CarbonImmutable $now): array
    {
        $pending = self::query()
            ->claimableAt($now)
            ->ofBindingsOnHost($hostId)
            ->oldestFirst()
            ->lock('for update skip locked')
            ->readExactly($limit)
            ->get();

        return array_values($pending->all());
    }

    /**
     * The same question this requester asked of the binding a moment ago, still waiting or answered within its keep
     * time, so asking again reuses it; a read that failed is reused only briefly, so a window shows the failure and a
     * later Retry asks the host again.
     *
     * @return Option<self>
     */
    public static function findRecentOf(
        ProjectBinding $binding,
        ProjectReadType $type,
        string $path,
        ActorReference $requester,
        CarbonImmutable $now,
    ): Option {
        return self::query()
            ->ofPath($binding, $type, $path)
            ->byActor($requester)
            ->stillKeptAt($now)
            ->newestFirst()
            ->firstOption();
    }

    /**
     * The read locked for its one answer.
     *
     * @throws ProjectReadRefused
     */
    public static function findLockedById(string $readId): self
    {
        return self::query()
            ->with('binding')
            ->whereKey($readId)
            ->lockForUpdate()
            ->firstOr(ProjectReadRefused::throwing()->missing($readId));
    }

    // ----------[ Scopes ]----------

    /**
     * The pending reads no host claimed that have not expired then.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function claimableAt(Builder $query, CarbonImmutable $now): void
    {
        $query->where('status', ProjectReadStatus::Pending->value)
            ->whereNull('claimed_at')
            ->where('expires_at', '>', $now);
    }

    /**
     * The reads of the bindings on the host.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofBindingsOnHost(Builder $query, string $hostId): void
    {
        $query->whereIn('binding_id', ProjectBinding::query()->onHost($hostId)->keys());
    }

    /**
     * The reads of that type of the binding's path.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPath(Builder $query, ProjectBinding $binding, ProjectReadType $type, string $path): void
    {
        $query->where('binding_id', $binding->id)->where('type', $type->value)->where('path', $path);
    }

    /**
     * The reads still kept then: a pending or answered one for its minutes, a failed one for its seconds.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function stillKeptAt(Builder $query, CarbonImmutable $now): void
    {
        $usableSince = $now->subMinutes(self::KEEP_MINUTES_LIMIT);
        $failedSince = $now->subSeconds(self::PENDING_SECONDS_LIMIT);
        $usable = [ProjectReadStatus::Pending->value, ProjectReadStatus::Answered->value];

        $query->where(fn (Builder $kept) => $kept
            ->where(fn (Builder $live) => $live->whereIn('status', $usable)->where('created_at', '>=', $usableSince))
            ->orWhere(fn (Builder $failed) => $failed
                ->where('status', ProjectReadStatus::Failed->value)
                ->where('created_at', '>=', $failedSince)));
    }

    /**
     * The rows of the given state.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withState(Builder $query, ProjectReadStatus $status): void
    {
        $query->where('status', $status);
    }

    /**
     * The reads whose time ran out before the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function expiredAt(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('expires_at', '<', $moment);
    }

    /**
     * The reads no longer pending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function settled(Builder $query): void
    {
        $query->where('status', '!=', ProjectReadStatus::Pending->value);
    }

    /**
     * The reads last changed before the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function updatedBefore(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('updated_at', '<', $moment);
    }
}
