<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\ProjectReadFailure;
use App\Enums\ProjectReadState;
use App\Enums\ProjectReadType;
use App\Exceptions\ProjectReadRefused;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use App\Values\ProjectEntry;
use App\Values\ProjectFileText;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * One read of a connected project's folder or file, asked by the server and answered once by the project's host: its
 * entries or its text, or why it failed. A read nobody answers in time expires; a settled read is kept for a while so
 * the same question asked again is answered from it.
 *
 * @property string $id
 * @property string $binding_id
 * @property ProjectReadType $type
 * @property string $path
 * @property string $actor_type
 * @property string $actor_id
 * @property ProjectReadState $state
 * @property ProjectReadFailure|null $failure
 * @property list<array{name: string, is_folder: bool, size: int}>|null $entries
 * @property string|null $text
 * @property string|null $digest
 * @property int|null $size
 * @property bool $is_truncated
 * @property CarbonImmutable|null $claimed_at
 * @property CarbonImmutable|null $answered_at
 * @property CarbonImmutable $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('project_reads')]
#[Fillable(['type', 'path', 'state'])]
final class ProjectRead extends Model implements ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;

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

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ProjectReadType::class,
            'state' => ProjectReadState::class,
            'failure' => ProjectReadFailure::class,
            'entries' => 'array',
            'size' => 'integer',
            'is_truncated' => 'boolean',
            'claimed_at' => 'immutable_datetime',
            'answered_at' => 'immutable_datetime',
            'expires_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new read of a folder or a file of the binding's project, waiting for its host.
     */
    public static function create(
        ProjectBinding $binding,
        ProjectReadType $type,
        string $path,
        ActorIdentity $requester,
    ): self {
        $read = new self();
        $read->binding_id = $binding->id;
        $read->type = $type;
        $read->path = $path;
        $read->actor_type = $requester->type->value;
        $read->actor_id = $requester->id;
        $read->state = ProjectReadState::Pending;
        $read->is_truncated = false;
        $read->expires_at = CarbonImmutable::now()->addSeconds(self::PENDING_SECONDS_LIMIT);
        $read->save();

        return $read;
    }

    // ----------[ Queries ]----------

    /**
     * The reads of this host's bindings no poll handed out yet and still in time, oldest first, locked so a poll beside
     * this one skips them.
     *
     * @return list<self>
     */
    public static function claimableFor(string $hostId, int $limit, CarbonImmutable $now): array
    {
        $pending = self::query()
            ->where('state', ProjectReadState::Pending->value)
            ->whereNull('claimed_at')
            ->where('expires_at', '>', $now)
            ->whereIn('binding_id', ProjectBinding::query()->where('host_id', $hostId)->select('id'))
            ->orderBy('created_at')
            ->lock('for update skip locked')
            ->readExactly($limit)
            ->get();

        return array_values($pending->all());
    }

    /**
     * The same question this requester asked of the binding a moment ago, still waiting or settled within its keep
     * time, so asking again reuses it.
     *
     * @return Option<self>
     */
    public static function recentOf(
        ProjectBinding $binding,
        ProjectReadType $type,
        string $path,
        ActorIdentity $requester,
        CarbonImmutable $now,
    ): Option {
        return self::query()
            ->where('binding_id', $binding->id)
            ->where('type', $type->value)
            ->where('path', $path)
            ->byActor($requester)
            ->whereIn('state', [ProjectReadState::Pending->value, ProjectReadState::Answered->value])
            ->where('created_at', '>=', $now->subMinutes(self::KEEP_MINUTES_LIMIT))
            ->latest()
            ->firstOption();
    }

    /**
     * The read locked for its one answer.
     *
     * @throws ProjectReadRefused
     */
    public static function lockById(string $readId): self
    {
        return self::query()->whereKey($readId)->lockForUpdate()->firstOr(
            fn () => throw ProjectReadRefused::missing($readId),
        );
    }

    // ----------[ Mutations ]----------

    /**
     * Marks the read handed out to its host, so a second poll does not hand it out again.
     */
    public function markClaimed(CarbonImmutable $now): void
    {
        $this->claimed_at = $now;
        $this->save();
    }

    /**
     * Answers a folder read with its entries, cut to the entry limit and marked cut when the host or the limit cut it.
     *
     * @param  list<ProjectEntry>  $entries
     */
    public function answerWithEntries(array $entries, bool $isTruncated): void
    {
        $this->entries = array_map(
            fn (ProjectEntry $entry) => $entry->fields(),
            array_slice($entries, 0, self::DIRECTORY_ENTRY_LIMIT),
        );

        $this->is_truncated = $isTruncated || count($entries) > self::DIRECTORY_ENTRY_LIMIT;
        $this->settle(ProjectReadState::Answered);
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
        $this->settle(ProjectReadState::Answered);
    }

    public function fail(ProjectReadFailure $failure): void
    {
        $this->failure = $failure;
        $this->settle(ProjectReadState::Failed);
    }

    // ----------[ Answers ]----------

    public function isSettled(): bool
    {
        return $this->state->isSettled();
    }

    public function isExpired(): bool
    {
        return $this->state === ProjectReadState::Expired;
    }

    /**
     * Whether the read is of a project this host runs.
     */
    public function isOfHost(string $hostId): bool
    {
        return ProjectBinding::query()->whereKey($this->binding_id)->where('host_id', $hostId)->exists();
    }

    /**
     * The folder's entries as the host listed them; none for a file or an unanswered read.
     *
     * @return list<ProjectEntry>
     */
    public function listedEntries(): array
    {
        return array_map(ProjectEntry::fromFields(...), $this->entries ?? []);
    }

    private function settle(ProjectReadState $state): void
    {
        $this->state = $state;
        $this->answered_at = CarbonImmutable::now();
        $this->save();
    }
}
