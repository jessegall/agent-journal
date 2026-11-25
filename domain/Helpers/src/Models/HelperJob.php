<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\ConversationModeType;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Support\OwnerStartReceipt;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Events\HelperJobAttached;
use Domain\Helpers\Events\HelperJobCancelled;
use Domain\Helpers\Events\HelperJobHeld;
use Domain\Helpers\Events\HelperJobLeftUnfinished;
use Domain\Helpers\Events\HelperJobReopenedForAttempt;
use Domain\Helpers\Events\HelperJobReopenedForRepair;
use Domain\Helpers\Events\HelperJobReported;
use Domain\Helpers\Events\HelperJobSteered;
use Domain\Helpers\Exceptions\HelperJobFinished;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\JobLaunch;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One job a parent gave a helper for a purpose: its brief, the source it was given, how far it got, the steering added
 * on the way and where its result and stop evidence are. Only its parent reads it.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $helper_identity_id
 * @property string $helper_purpose_id
 * @property string $brief
 * @property list<string> $source_subjects
 * @property string $request_id
 * @property JobState $state
 * @property list<string> $steering
 * @property string|null $stop_evidence_reference
 * @property int $profile_revision
 * @property CarbonImmutable|null $finished_at
 * @property string $payload_digest
 * @property bool $identity_new
 * @property bool $independent
 * @property ConversationModeType $conversation_mode
 * @property string $conversation_reason
 */
#[Table('helper_jobs')]
#[Fillable([
    'brief',
    'source_subjects',
    'request_id',
    'state',
    'steering',
    'profile_revision',
])]
final class HelperJob extends Model implements Assignable, EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => JobState::class,
            'source_subjects' => 'array',
            'steering' => 'array',
            'finished_at' => 'immutable_datetime',
            'identity_new' => 'boolean',
            'independent' => 'boolean',
            'conversation_mode' => ConversationModeType::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * @param  list<string>  $sourceSubjects
     */
    public static function create(
        HelperIdentity $helper,
        HelperPurpose $purpose,
        ActorIdentity $parent,
        string $brief,
        array $sourceSubjects,
        JobLaunch $launch,
    ): self {
        $job = new self();
        $job->helper_identity_id = $helper->id;
        $job->helper_purpose_id = $purpose->id;
        $job->brief = $brief;
        $job->source_subjects = $sourceSubjects;
        $job->request_id = $launch->requestId;
        $job->payload_digest = $launch->payloadDigest;
        $job->profile_revision = $launch->profileRevision;
        $job->identity_new = $launch->isNewIdentity;
        $job->independent = $launch->isIndependent;
        $job->conversation_mode = $launch->conversationMode;
        $job->conversation_reason = $launch->conversationReason;
        $job->state = JobState::Accepted;
        $job->steering = [];
        $job->belongTo($parent);
        $job->save();

        return $job;
    }

    // ----------[ Mutations ]----------

    /**
     * Opens the unfinished job for another attempt; its brief, purpose, steering and source stay.
     */
    public function reopenForAttempt(): void
    {
        $this->moveTo(JobState::Accepted);
        $this->assertSaved($this->save());
        $this->raise(new HelperJobReopenedForAttempt($this->id));
    }

    /**
     * Opens finished, reviewed work again for repair on the same helper and checkout: its history and certificate
     * stay, the findings join its steering, and it is unfinished until a new stop certifies it.
     */
    public function reopenForRepair(string $findings): void
    {
        $this->state = JobState::Accepted;
        $this->finished_at = null;
        $this->steering = [
            ...$this->steering,
            $findings,
        ];
        $this->assertSaved($this->save());
        $this->raise(new HelperJobReopenedForRepair($this->id, $findings));
    }

    /**
     * The accepted job attached to the session its start opened, and runs there.
     */
    public function attachTo(string $sessionId): void
    {
        $this->moveTo(JobState::Running);
        $this->assertSaved($this->save());
        $this->raise(new HelperJobAttached($this->id, $sessionId));
    }

    public function addSteering(string $steering): void
    {
        $this->moveTo($this->state);
        $this->steering = [
            ...$this->steering,
            $steering,
        ];
        $this->assertSaved($this->save());
        $this->raise(new HelperJobSteered($this->id, $steering));
    }

    /**
     * Finishes the job on the stop evidence that certified its work complete.
     */
    public function finish(string $reference): void
    {
        $this->moveTo(JobState::Finished);
        $this->stop_evidence_reference = $reference;
        $this->finished_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new HelperJobReported($this->id, $reference));
    }

    public function cancel(): void
    {
        $this->moveTo(JobState::Cancelled);
        $this->assertSaved($this->save());
        $this->raise(new HelperJobCancelled($this->id));
    }

    /**
     * Holds the job for repair on the stop evidence that failed the same way three times.
     */
    public function hold(string $stopEvidenceReference): void
    {
        $this->moveTo(JobState::Held);
        $this->stop_evidence_reference = $stopEvidenceReference;
        $this->assertSaved($this->save());
        $this->raise(new HelperJobHeld($this->id));
    }

    public function markUnfinished(string $stopEvidenceReference): void
    {
        $this->moveTo(JobState::Unfinished);
        $this->stop_evidence_reference = $stopEvidenceReference;
        $this->assertSaved($this->save());
        $this->raise(new HelperJobLeftUnfinished($this->id));
    }

    /**
     * The job's dispatch receipt, with the profile type it was launched under and Core's start for it.
     */
    public function receipt(string $profileType, OwnerStartReceipt $start, bool $isNewJob): HelperReceipt
    {
        return new HelperReceipt(
            $this->helper_identity_id,
            $this->id,
            $isNewJob,
            $profileType,
            $this->state,
            $this->launch,
            $start,
        );
    }

    public function wasDispatchedAs(string $payloadDigest): bool
    {
        return $this->payload_digest === $payloadDigest;
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }

    public function isFinished(): bool
    {
        return $this->state->isFinal();
    }

    /**
     * The actor whose helper this job is, the parent that started it.
     */
    public function actor(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id);
    }

    /**
     * The records the job was given as its source, written as type:id.
     *
     * @return list<string>
     */
    public function sourceSubjects(): array
    {
        return $this->source_subjects;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<JobLaunch, never>
     */
    protected function launch(): Attribute
    {
        return Accessor::get(fn () => new JobLaunch(
            $this->request_id,
            $this->payload_digest,
            $this->profile_revision,
            $this->identity_new,
            $this->independent,
            $this->conversation_mode,
            $this->conversation_reason,
        ));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a move of a job that already finished.
     *
     * @throws HelperJobFinished
     */
    private function assertNotFinished(): void
    {
        if ($this->state->isFinal()) {
            throw HelperJobFinished::forJob($this->id, $this->state->value);
        }
    }

    // ----------[ Internals ]----------

    private function moveTo(JobState $state): void
    {
        $this->assertNotFinished();

        $this->state = $state;
    }

    // ----------[ Queries ]----------

    /**
     * Whether the helper already had a job of this purpose: the same subject, or the same named work.
     */
    public static function existsFor(HelperIdentity $identity, HelperPurpose $purpose): bool
    {
        return self::query()->acrossActors()
            ->ofIdentity($identity)
            ->forPurposeLike($purpose)
            ->exists();
    }

    /**
     * The newest jobs of every helper, at most the limit, newest first.
     *
     * @return Collection<int, self>
     */
    public static function newest(int $limit): Collection
    {
        return self::query()->acrossActors()->newestFirst()->limit($limit)->get();
    }

    /**
     * How many jobs of every helper are not yet finished, cancelled or failed.
     */
    public static function openCount(): int
    {
        return self::query()->acrossActors()->open()->count();
    }

    // ----------[ Scopes ]----------

    /**
     * Jobs not yet finished, cancelled or failed; a held or unfinished job still keeps its helper from new work.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function open(Builder $query): void
    {
        $query->whereNotIn('state', array_map(
            fn (JobState $state) => $state->value,
            array_filter(JobState::cases(), fn (JobState $state) => $state->isFinal()),
        ));
    }

    /**
     * Jobs of the identities named.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $identityIds
     */
    #[Scope]
    protected function ofIdentities(Builder $query, array $identityIds): void
    {
        $query->whereIn('helper_identity_id', $identityIds);
    }

    /**
     * Jobs that saw the subject: given for a purpose about it, or handed it in their source.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function exposedTo(Builder $query, RecordIdentity $subject): void
    {
        $query->where(fn (Builder $exposed) => $exposed
            ->whereIn('helper_purpose_id', HelperPurpose::query()
                ->where('subject_type', $subject->type)
                ->where('subject_id', $subject->id)
                ->select('id'))
            ->orWhereJsonContains('source_subjects', sprintf('%s:%s', $subject->type, $subject->id)));
    }

    /**
     * The identity's jobs.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofIdentity(Builder $query, HelperIdentity $identity): void
    {
        $query->where('helper_identity_id', $identity->id);
    }

    /**
     * The jobs for a purpose the same as this one.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forPurposeLike(Builder $query, HelperPurpose $purpose): void
    {
        $query->whereIn('helper_purpose_id', HelperPurpose::sameAs($purpose)->select('id'));
    }
}
