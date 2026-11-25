<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\InstallAttemptState;
use App\Enums\InvitationMode;
use App\Events\Connections\InstallAttemptCancelled;
use App\Events\Connections\InstallAttemptOpened;
use App\Events\Connections\InstallAttemptReplaced;
use App\Events\Connections\InstallAttemptSpent;
use App\Exceptions\InstallAttemptRefused;
use App\Support\ShortReference;
use App\Values\RelationRead;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * One owner's attempt to install a line for one target, a new project or one to join, made before any ticket is
 * issued. Its public reference names it in the window and in Settings, never a secret. Every change locks the row
 * and checks the version the owner saw, so two tabs each keep their own attempt and a repeated change cannot leave
 * two live lines.
 *
 * @property string $id
 * @property string $reference
 * @property string $owner_user_id
 * @property string $idempotency_key
 * @property InvitationMode $mode
 * @property string|null $project_id
 * @property string|null $environment_id
 * @property InstallAttemptState $state
 * @property string|null $binding_id
 * @property int $version
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $target_label
 * @property-read Project|null $project
 * @property-read Environment|null $environment
 */
#[Fillable([
    'reference',
    'owner_user_id',
    'idempotency_key',
    'mode',
    'project_id',
    'environment_id',
    'state',
    'version',
])]
final class InstallAttempt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * How long a settled attempt stays listed.
     */
    public const int LISTED_DAYS = 30;

    /**
     * The most lines one attempt holds, each replacement adding one.
     */
    public const int LINE_LIMIT = 100;

    /**
     * The most attempts one page of the list holds.
     */
    public const int PAGE_LIMIT = 25;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mode' => InvitationMode::class,
            'state' => InstallAttemptState::class,
            'version' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The owner's attempt under this key, opened now when there is none: two first submissions of one key make one
     * attempt, as the key is unique per owner. A Join attempt names the environment of the project it lands in.
     */
    public static function create(string $userId, string $idempotencyKey, Environment|null $joins): self
    {
        $earlier = self::query()->ofOwner($userId)->withIdempotencyKey($idempotencyKey)->lockForUpdate()
            ->limit(1)->get()->all();

        foreach ($earlier as $attempt) {
            return $attempt;
        }

        // Only two first submissions at once reach this far; the key's unique index keeps them one attempt.
        $attempt = self::query()->createOrFirst(
            [
                'owner_user_id' => $userId,
                'idempotency_key' => $idempotencyKey,
            ],
            [
                'reference' => ShortReference::withPrefix('IA'),
                'mode' => $joins === null ? InvitationMode::New : InvitationMode::Join,
                'project_id' => $joins?->project_id,
                'environment_id' => $joins?->id,
                'state' => InstallAttemptState::Open,
                'version' => 0,
            ],
        );

        if ($attempt->wasRecentlyCreated) {
            $attempt->raise(new InstallAttemptOpened($attempt->id, $attempt->reference, CarbonImmutable::now()));
        }

        return self::lockById($attempt->id);
    }

    // ----------[ Mutations ]----------

    /**
     * Moves the attempt to its next version for a successor line, once the version the owner saw is the current one;
     * a settled attempt answers what came of it.
     *
     * @throws InstallAttemptRefused
     */
    public function replace(int|null $seenVersion): void
    {
        $this->assertChangeable($seenVersion);
        $this->version++;
        $this->assertSaved($this->save());
        $this->raise(new InstallAttemptReplaced($this->id, $this->version, CarbonImmutable::now()));
    }

    /**
     * Ends the attempt for good, at the version the owner saw.
     *
     * @throws InstallAttemptRefused
     */
    public function cancel(int|null $seenVersion): void
    {
        $this->assertChangeable($seenVersion);
        $this->state = InstallAttemptState::Cancelled;
        $this->version++;
        $this->assertSaved($this->save());
        $this->raise(new InstallAttemptCancelled($this->id, CarbonImmutable::now()));
    }

    /**
     * Records the binding the attempt's line made.
     */
    public function spendOn(ProjectBinding $binding): void
    {
        $this->state = InstallAttemptState::Spent;
        $this->binding_id = $binding->id;
        $this->version++;
        $this->assertSaved($this->save());
        $this->raise(new InstallAttemptSpent($this->id, $binding->id, CarbonImmutable::now()));
    }

    // ----------[ Transformers ]----------

    /**
     * Where the attempt stands now: an open attempt whose line can no longer be redeemed reads as expired.
     */
    public function stateAt(CarbonImmutable $now): InstallAttemptState
    {
        if ($this->state !== InstallAttemptState::Open) {
            return $this->state;
        }

        $live = $this->invitations->filter(fn (ProjectInvitation $line) => $line->isRedeemableAt($now));

        if ($live->isEmpty()) {
            return InstallAttemptState::Expired;
        }

        return InstallAttemptState::Open;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<string, never>
     */
    protected function targetLabel(): Attribute
    {
        return Attribute::get(fn () => $this->targetText());
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<ProjectInvitation, $this>
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(ProjectInvitation::class, 'install_attempt_id');
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<Environment, $this>
     */
    public function environment(): BelongsTo
    {
        return $this->belongsTo(Environment::class);
    }

    // ----------[ Asserts ]----------

    /**
     * @throws InstallAttemptRefused
     */
    private function assertChangeable(int|null $seenVersion): void
    {
        if ($this->state === InstallAttemptState::Spent) {
            throw InstallAttemptRefused::spent($this->reference, (string) $this->binding_id);
        }

        if ($this->state === InstallAttemptState::Cancelled) {
            throw InstallAttemptRefused::cancelled($this->reference);
        }

        if ($seenVersion !== null && $seenVersion !== $this->version) {
            throw InstallAttemptRefused::movedOn($this->reference, $this->version);
        }
    }

    // ----------[ Internals ]----------

    /**
     * The target's words: a project or environment deleted since, which empties its key, is named as gone.
     */
    private function targetText(): string
    {
        if ($this->mode === InvitationMode::New) {
            return 'New project';
        }

        $project = $this->project_id === null ? 'a project that is gone' : $this->project->label;
        $environment = $this->environment_id === null ? 'an environment that is gone' : $this->environment->label;

        return $project.' / '.$environment;
    }

    // ----------[ Queries ]----------

    /**
     * The owner's attempt of this reference, locked until the transaction ends.
     *
     * @throws InstallAttemptRefused
     */
    public static function lockOfOwner(string $userId, string $reference): self
    {
        return self::query()
            ->ofOwner($userId)
            ->withReference($reference)
            ->lockForUpdate()
            ->firstOr(InstallAttemptRefused::throwing()->unknown($reference));
    }

    public static function lockById(string $id): self
    {
        return self::lockedById($id);
    }

    /**
     * One page of the owner's attempts, newest first: every open one, and the settled ones of the last LISTED_DAYS.
     *
     * @return CursorPaginator<int, self>
     */
    public static function listedFor(string $userId, string|null $cursor): CursorPaginator
    {
        $since = CarbonImmutable::now()->subDays(self::LISTED_DAYS);

        return self::query()->ofOwner($userId)
            ->openOrChangedSince($since)
            ->with([
                'invitations' => RelationRead::complete(max: self::LINE_LIMIT)->constraint(),
                'project',
                'environment',
            ])
            ->newestFirst()
            ->cursorPaginate(self::PAGE_LIMIT, cursor: $cursor);
    }

    // ----------[ Scopes ]----------

    /**
     * The attempts of one owner.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofOwner(Builder $query, string $userId): void
    {
        $query->where('owner_user_id', $userId);
    }

    /**
     * The attempt made under that idempotency key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withIdempotencyKey(Builder $query, string $key): void
    {
        $query->where('idempotency_key', $key);
    }

    /**
     * The attempt of that reference.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withReference(Builder $query, string $reference): void
    {
        $query->where('reference', $reference);
    }

    /**
     * The attempts still open, or changed since that moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function openOrChangedSince(Builder $query, CarbonImmutable $since): void
    {
        $query->where(fn (Builder $listed) => $listed->where('state', InstallAttemptState::Open)
            ->orWhere('updated_at', '>=', $since));
    }
}
