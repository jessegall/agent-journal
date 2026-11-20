<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Assignments\Contracts\Assignable;
use App\Links\Support\Linkable;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\SupervisorTarget;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use App\Supervision\Enums\AskOriginType;
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
 * @property int $version
 * @property bool $open
 */
#[Fillable(['version', 'pending_target', 'open'])]
final class Ask extends Model implements Assignable, ReadableModel
{
    use BelongsToOneActor, BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.ask';

    protected function casts(): array
    {
        return ['version' => 'integer', 'open' => 'boolean'];
    }

    public static function newReference(): AskReference
    {
        return new AskReference(new self()->newUniqueId());
    }

    /** @return Option<self> */
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

    public function requester(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id);
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

    public function accept(ActorIdentity $holder, int $routeVersion): void
    {
        $this->version++;
        $this->pending_target = null;
        $this->save();
        AskHop::recordAcceptance($this, $holder, $routeVersion);
    }

    public function close(): void
    {
        $this->version++;
        $this->open = false;
        $this->pending_target = null;
        $this->save();
    }

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
