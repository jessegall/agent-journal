<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Connections\Enums\InstallAttemptState;
use App\Connections\Enums\InvitationMode;
use App\Connections\Events\InstallAttemptCancelled;
use App\Connections\Events\InstallAttemptOpened;
use App\Connections\Events\InstallAttemptReplaced;
use App\Connections\Events\InstallAttemptSpent;
use App\Connections\Exceptions\InstallAttemptRefused;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Reads\Values\RelationRead;
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
use Illuminate\Support\Str;

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
    'reference', 'owner_user_id', 'idempotency_key', 'mode', 'project_id', 'environment_id', 'state', 'version',
])]
final class InstallAttempt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
     * The letters a reference is made of: no 0, O, 1, I or L, which read alike.
     */
    private const string REFERENCE_LETTERS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

    // ----------[ Constructors ]----------

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

    /**
     * The owner's attempt under this key, opened now when there is none: two first submissions of one key make one
     * attempt, as the key is unique per owner. A Join attempt names the environment of the project it lands in.
     */
    public static function openFor(string $ownerUserId, string $idempotencyKey, Environment|null $joins): self
    {
        $id = (string) Str::ulid();
        $now = CarbonImmutable::now();
        // A second first submission under the key inserts nothing, without the error that would end the transaction.
        self::query()->insertOrIgnore([
            'id' => $id,
            'reference' => self::newReference(),
            'owner_user_id' => $ownerUserId,
            'idempotency_key' => $idempotencyKey,
            'mode' => ($joins === null ? InvitationMode::New : InvitationMode::Join)->value,
            'project_id' => $joins?->project_id,
            'environment_id' => $joins?->id,
            'state' => InstallAttemptState::Open->value,
            'version' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $attempt = self::query()->ofOwner($ownerUserId)->where('idempotency_key', $idempotencyKey)->lockForUpdate()
            ->firstOrFail();

        if ($attempt->id === $id) {
            $attempt->raise(new InstallAttemptOpened($attempt->id, $attempt->reference, $now));
        }

        return $attempt;
    }

    // ----------[ Queries ]----------

    /**
     * The owner's attempt of this reference, locked until the transaction ends.
     *
     * @throws InstallAttemptRefused
     */
    public static function lockOfOwner(string $ownerUserId, string $reference): self
    {
        return self::query()->ofOwner($ownerUserId)->where('reference', $reference)->lockForUpdate()
            ->firstOr(fn () => throw InstallAttemptRefused::unknown($reference));
    }

    public static function lockById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * One page of the owner's attempts, newest first: every open one, and the settled ones of the last LISTED_DAYS.
     *
     * @return CursorPaginator<int, self>
     */
    public static function listedFor(string $ownerUserId, string|null $cursor): CursorPaginator
    {
        $since = CarbonImmutable::now()->subDays(self::LISTED_DAYS);

        return self::query()->ofOwner($ownerUserId)
            ->where(fn (Builder $listed) => $listed->where('state', InstallAttemptState::Open)
                ->orWhere('updated_at', '>=', $since))
            ->with([
                'invitations' => RelationRead::complete(max: self::LINE_LIMIT)->constraint(),
                'project',
                'environment',
            ])
            ->orderByDesc('created_at')->orderByDesc('id')
            ->cursorPaginate(self::PAGE_LIMIT, cursor: $cursor);
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

    // ----------[ Answers ]----------

    /**
     * Where the attempt stands now: an open attempt whose line can no longer be redeemed reads as expired.
     */
    public function stateAt(CarbonImmutable $now): InstallAttemptState
    {
        if ($this->state !== InstallAttemptState::Open) {
            return $this->state;
        }

        $live = $this->invitations->filter(fn (ProjectInvitation $line) => $line->isRedeemableAt($now));

        return $live->isEmpty() ? InstallAttemptState::Expired : InstallAttemptState::Open;
    }

    /**
     * The target as the owner's list names it: New project, or the project and environment it joins; a Join whose
     * environment is gone says so.
     */
    /**
     * @return Attribute<string, never>
     */
    protected function targetLabel(): Attribute
    {
        return Attribute::get(function (): string {
            if ($this->mode === InvitationMode::New) {
                return 'New project';
            }

            $environment = $this->environment?->label ?? 'an environment that is gone';

            return ($this->project?->label ?? 'a project').' / '.$environment;
        });
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

    // ----------[ Internals ]----------

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

    private static function newReference(): string
    {
        $letters = '';

        for ($index = 0; $index < 8; $index++) {
            $letters .= self::REFERENCE_LETTERS[random_int(0, strlen(self::REFERENCE_LETTERS) - 1)];
        }

        return 'IA-'.$letters;
    }

    // ----------[ Scopes ]----------

    /**
     * The attempts of one owner.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofOwner(Builder $query, string $ownerUserId): void
    {
        $query->where('owner_user_id', $ownerUserId);
    }
}
