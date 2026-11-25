<?php

declare(strict_types=1);

namespace App\Models\Asks;

use App\Casts\AskTypeKeyCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\AskOriginType;
use App\Enums\UnansweredReason;
use App\Events\Asks\AskAccepted;
use App\Events\Asks\AskAnsweredLate;
use App\Events\Asks\AskClosed;
use App\Events\Asks\AskEscalated;
use App\Exceptions\AskRefused;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Values\AskReference;
use App\Values\AskSubject;
use App\Values\AskTypeKey;
use App\Values\OwnerRoute;
use App\Values\ProfileKey;
use App\Values\SupervisorTarget;
use App\Values\WorkReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property AskTypeKey $type_key
 * @property string $body
 * @property string $submission_hash
 * @property string $work
 * @property string|null $head
 * @property string|null $pending_target
 * @property string|null $route_profile
 * @property int $version
 * @property bool $open
 * @property UnansweredReason|null $outcome
 * @property string|null $late_answer
 * @property Carbon $created_at
 */
#[Fillable([
    'version',
    'pending_target',
    'open',
    'outcome',
    'late_answer',
])]
final class Ask extends Model implements Assignable, EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * How long an ask may stay open, however it progresses, before it closes unanswered.
     */
    public const int LIFETIME_HOURS = 48;

    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'open' => 'boolean',
            'outcome' => UnansweredReason::class,
            'type_key' => AskTypeKeyCast::class,
        ];
    }

    // ----------[ Mutations ]----------

    public function accept(): void
    {
        $this->version++;
        $this->pending_target = null;
        $this->save();
        $this->raise(new AskAccepted($this->id));
    }

    /**
     * Names the next target of an escalation, for the routing that follows in the same transaction.
     */
    public function escalateTo(SupervisorTarget $target): void
    {
        $this->pending_target = $target->key;
        $this->save();
        $this->raise(new AskEscalated($this->id, $target->key));
    }

    /**
     * Adds the owner's late text to an unanswered ask as a new version; its outcome and time stay as they were.
     */
    public function answerLate(string $text): void
    {
        $this->late_answer = $text;
        $this->version++;
        $this->save();
        $this->raise(new AskAnsweredLate($this->id));
    }

    public function close(): void
    {
        $this->version++;
        $this->open = false;
        $this->pending_target = null;
        $this->assertSaved($this->save());
        $this->raise(new AskClosed($this->id, $this->type_key->key));
    }

    public function closeUnanswered(UnansweredReason $reason): void
    {
        $this->outcome = $reason;
        $this->close();
    }

    // ----------[ Predicates ]----------

    public function isUnanswered(): bool
    {
        return ! $this->open && $this->outcome !== null;
    }

    public function hasOutlived(CarbonImmutable $now): bool
    {
        return CarbonImmutable::instance($this->created_at)->addHours(self::LIFETIME_HOURS) <= $now;
    }

    // ----------[ Transformers ]----------

    public function replay(AskTypeKey $type, string $body): AskReference
    {
        $this->assertSameSubmission($type, $body);

        return $this->reference();
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }

    public function requirePending(int $version): SupervisorTarget
    {
        $this->assertPendingAt($version);

        return SupervisorTarget::parse($this->pending_target);
    }

    public function reference(): AskReference
    {
        return new AskReference($this->id);
    }

    public function workReference(): WorkReference
    {
        return new WorkReference($this->work);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a repeated submission whose content differs from the first one under its key.
     *
     * @throws AskRefused
     */
    private function assertSubmittedAs(string $digest): void
    {
        if (! hash_equals($this->submission_hash, $digest)) {
            throw AskRefused::submissionChanged();
        }
    }

    /**
     * Refuses a replay that names another type or body than the ask holds.
     *
     * @throws AskRefused
     */
    private function assertSameSubmission(AskTypeKey $type, string $body): void
    {
        if ($type->key !== $this->type_key->key || $body !== $this->body) {
            throw AskRefused::submissionChanged();
        }
    }

    /**
     * Refuses an ask that closed, moved on from the version named, or waits on no one.
     *
     * @phpstan-assert !null $this->pending_target
     *
     * @throws AskRefused
     */
    private function assertPendingAt(int $version): void
    {
        if (! $this->open || $this->version !== $version || $this->pending_target === null) {
            throw AskRefused::routeChanged();
        }
    }

    // ----------[ Queries ]----------

    public static function newReference(): AskReference
    {
        return new AskReference(new self()->newUniqueId());
    }

    /**
     * @return Option<self>
     */
    public static function submission(ActorIdentity $actor, string $key): Option
    {
        return Option::fromValue(self::query()->ownedBy($actor)->underSubmissionKey($key)->first());
    }

    public static function openSubmissions(ActorIdentity $actor): int
    {
        return self::query()->ownedBy($actor)
            ->fromOrigin(AskOriginType::Supervisor)
            ->open()
            ->count();
    }

    public static function submit(
        AskReference $reference,
        ActorIdentity $requester,
        AskTypeKey $type,
        string $submissionKey,
        string $body,
        AskSubject $subject,
        SupervisorTarget $target,
        AskOriginType $origin = AskOriginType::Internal,
        ProfileKey|null $routeProfile = null,
    ): self {
        $work = $subject->work->isFree() ? 'free' : $subject->work->key;
        $digest = hash('sha256', json_encode([
            $type->key,
            $body,
            $work,
        ], JSON_THROW_ON_ERROR));
        $ask = new self();

        $ask->setRawAttributes([
            'id' => $reference->id,
            'actor_type' => $requester->type->value,
            'actor_id' => $requester->id,
            'type_key' => $type->key,
            'origin' => $origin->value,
            'submission_key' => $submissionKey,
            'submission_hash' => $digest,
            'body' => $body,
            'subject_type' => $subject->type->key,
            'work' => $subject->work->key,
            'head' => $subject->head,
            'pending_target' => $target->key,
            'route_profile' => $routeProfile?->key,
            'version' => 0,
            'open' => true,
        ]);

        $ask->insertIfAbsent();
        $ask = self::query()->ownedBy($requester)->underSubmissionKey($submissionKey)->firstOrFail();
        $ask->assertSubmittedAs($digest);

        return $ask;
    }

    public static function forAttention(string $id): self
    {
        return self::query()->acrossActors()->whereKey($id)->firstOrFail();
    }

    /**
     * The open asks of the ids, by id, for trusted maintenance across actors.
     *
     * @param  list<string>  $ids
     * @return array<string, self>
     */
    public static function openByIds(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        $asks = self::query()->acrossActors()->whereKey($ids)->open()->readExactly(count($ids))->get();

        return $asks->keyBy('id')->all();
    }

    /**
     * The open asks about one work, locked, whoever asked them.
     *
     * @return list<self>
     */
    public static function openFor(RecordIdentity $work): array
    {
        return array_values(self::query()
            ->acrossActors()
            ->aboutWork($work)
            ->open()
            ->lockForUpdate()
            ->readAll('the open asks about one work, a review and a merge at most')
            ->get()
            ->all());
    }

    public static function lockedForMaintenance(string $id): self
    {
        return self::query()->acrossActors()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function visibleToParticipant(Builder $query, ActorIdentity $actor, OwnerRoute $owner): void
    {
        $query->withoutGlobalScope(self::ownerScope());

        if ($owner->actor?->isSameAs($actor)) {
            return;
        }

        $query->where(fn (Builder $participants) => $participants->where(
            fn (Builder $requester) => $requester->byActor($actor),
        )->orWhereIn('id', AskHop::query()->byActor($actor)->select('ask_id')));
    }

    /**
     * The ask submitted under that key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function underSubmissionKey(Builder $query, string $key): void
    {
        $query->where('submission_key', $key);
    }

    /**
     * The asks of that origin.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function fromOrigin(Builder $query, AskOriginType $origin): void
    {
        $query->where('origin', $origin->value);
    }

    /**
     * The open asks.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function open(Builder $query): void
    {
        $query->where('open', true);
    }

    /**
     * The asks about the work.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function aboutWork(Builder $query, RecordIdentity $work): void
    {
        $query->where('work', WorkReference::forRecord($work)->key);
    }
}
