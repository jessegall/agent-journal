<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Models\Support\HasActorColumns;
use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Assignments\Contracts\Assignable;
use App\Links\Support\Linkable;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\SupervisorTarget;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use App\Supervision\Enums\AskOriginType;
use App\Supervision\Enums\UnansweredReason;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Values\AskReference;
use App\Supervision\Values\AskSubject;
use App\Supervision\Values\OwnerRoute;
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
 * @property string $type_key
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
#[Fillable(['version', 'pending_target', 'open', 'outcome', 'late_answer'])]
final class Ask extends Model implements Assignable, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.ask';

    /**
     * How long an ask may stay open, however it progresses, before it closes unanswered.
     */
    public const int LIFETIME_HOURS = 48;

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return ['version' => 'integer', 'open' => 'boolean', 'outcome' => UnansweredReason::class];
    }

    public static function newReference(): AskReference
    {
        return new AskReference(new self()->newUniqueId());
    }

    // ----------[ Queries ]----------

    /**
     * @return Option<self>
     */
    public static function submission(ActorIdentity $actor, string $key): Option
    {
        return Option::fromValue(self::query()->ownedBy($actor)->where('submission_key', $key)->first());
    }

    public static function openSubmissions(ActorIdentity $actor): int
    {
        return self::query()->ownedBy($actor)
            ->where('origin', AskOriginType::Supervisor->value)
            ->where('open', true)
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
        $digest = hash('sha256', json_encode([$type->key, $body, $work], JSON_THROW_ON_ERROR));
        $now = CarbonImmutable::now();
        $query = self::query()->ownedBy($requester)->where('submission_key', $submissionKey);
        $query->insertOrIgnore([
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
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $ask = $query->firstOrFail();

        if (! hash_equals($ask->submission_hash, $digest)) {
            throw AskRefused::submissionChanged();
        }

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

        $asks = self::query()->acrossActors()->whereKey($ids)->where('open', true)->readExactly(count($ids))->get();

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
            ->where('work', WorkReference::forRecord($work)->key)
            ->where('open', true)
            ->lockForUpdate()
            ->readAll('the open asks about one work, a review and a merge at most')
            ->get()
            ->all());
    }

    public static function lockedForMaintenance(string $id): self
    {
        return self::query()->acrossActors()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    public function accept(ActorIdentity $holder, int $routeVersion): AskHop
    {
        $this->version++;
        $this->pending_target = null;
        $this->save();

        return AskHop::create($this, $holder, $routeVersion);
    }

    /**
     * Names the next target of an escalation, for the routing that follows in the same transaction.
     */
    public function escalateTo(SupervisorTarget $target): void
    {
        $this->pending_target = $target->key;
        $this->save();
    }

    /**
     * Adds the owner's late text to an unanswered ask as a new version; its outcome and time stay as they were.
     */
    public function answerLate(string $text): void
    {
        $this->late_answer = $text;
        $this->version++;
        $this->save();
    }

    public function close(): void
    {
        $this->version++;
        $this->open = false;
        $this->pending_target = null;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function replay(AskTypeKey $type, string $body): AskReference
    {
        if ($type->key !== $this->type_key || $body !== $this->body) {
            throw AskRefused::submissionChanged();
        }

        return $this->reference();
    }

    public function reference(): AskReference
    {
        return new AskReference($this->id);
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    public function typeKey(): AskTypeKey
    {
        return AskTypeKey::from($this->type_key);
    }

    public function workReference(): WorkReference
    {
        return new WorkReference($this->work);
    }

    public function requirePending(int $version): SupervisorTarget
    {
        if (! $this->open || $this->version !== $version || $this->pending_target === null) {
            throw AskRefused::routeChanged();
        }

        return SupervisorTarget::parse($this->pending_target);
    }

    public function closeUnanswered(UnansweredReason $reason): void
    {
        $this->outcome = $reason;
        $this->close();
    }

    public function isUnanswered(): bool
    {
        return ! $this->open && $this->outcome !== null;
    }

    public function hasOutlived(CarbonImmutable $now): bool
    {
        return CarbonImmutable::instance($this->created_at)->addHours(self::LIFETIME_HOURS) <= $now;
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
}
