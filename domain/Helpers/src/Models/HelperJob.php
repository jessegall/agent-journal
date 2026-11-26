<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Events\EventSource;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Records\ReadableModel;
use App\Enums\Agents\ConversationModeType;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Support\OwnerStartReceipt;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Events\HelperJobAttached;
use Domain\Helpers\Events\HelperJobCancelled;
use Domain\Helpers\Events\HelperJobFinished;
use Domain\Helpers\Events\HelperJobHeld;
use Domain\Helpers\Events\HelperJobLeftUnfinished;
use Domain\Helpers\Events\HelperJobReopenedForAttempt;
use Domain\Helpers\Events\HelperJobSteered;
use Domain\Helpers\Exceptions\HelperJobEnded;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\SessionStartDetails;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;

/**
 * @property string $id
 * @property string $project_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $helper_identity_id
 * @property string $helper_purpose_id
 * @property string $brief
 * @property list<string> $source_subjects
 * @property string $request_id
 * @property JobStatus $status
 * @property list<string> $steering
 * @property string|null $stop_evidence_reference
 * @property int $profile_revision
 * @property CarbonImmutable|null $finished_at
 * @property string $payload_digest
 * @property bool $identity_new
 * @property bool $independent
 * @property ConversationModeType $conversation_mode
 * @property string $conversation_reason
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $start_details
 *
 * @mixin \Eloquent
 */
#[Table('helper_jobs')]
final class HelperJob extends JournalModel implements Assignable, EventSource, ProjectOwned, ReadableModel
{
    use BelongsToOneActor;
    use BelongsToProject;
    use BoundedReads;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     *
     * @column source_subjects list<string>
     * @column steering list<string>
     */
    protected function casts(): array
    {
        return [
            'status' => JobStatus::class,
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
     * A job of its purpose's project.
     *
     * @param  list<string>  $sourceSubjects
     */
    public static function create(
        HelperIdentity $helper,
        HelperPurpose $purpose,
        ActorReference $parent,
        string $brief,
        array $sourceSubjects,
        SessionStartDetails $startDetails,
    ): self {
        $job = new self();
        $job->project_id = $purpose->project_id;
        $job->helper_identity_id = $helper->id;
        $job->helper_purpose_id = $purpose->id;
        $job->brief = $brief;
        $job->source_subjects = $sourceSubjects;
        $job->request_id = $startDetails->requestId;
        $job->payload_digest = $startDetails->payloadDigest;
        $job->profile_revision = $startDetails->profileRevision;
        $job->identity_new = $startDetails->isNewIdentity;
        $job->independent = $startDetails->isIndependent;
        $job->conversation_mode = $startDetails->conversationMode;
        $job->conversation_reason = $startDetails->conversationReason;
        $job->status = JobStatus::Accepted;
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
        $this->moveTo(JobStatus::Accepted);
        $this->saveAndAssert();
        $this->raise(new HelperJobReopenedForAttempt($this->id));
    }

    /**
     * The accepted job attached to the session its start opened, and runs there.
     */
    public function attachTo(string $sessionId): void
    {
        $this->moveTo(JobStatus::Running);
        $this->saveAndAssert();
        $this->raise(new HelperJobAttached($this->id, $sessionId));
    }

    public function addSteering(string $steering): void
    {
        $this->moveTo($this->status);

        $this->steering = [
            ...$this->steering,
            $steering,
        ];

        $this->saveAndAssert();
        $this->raise(new HelperJobSteered($this->id, $steering));
    }

    /**
     * Finishes the job on the stop evidence that certified its work complete.
     */
    public function finish(string $reference): void
    {
        $this->moveTo(JobStatus::Finished);
        $this->stop_evidence_reference = $reference;
        $this->finished_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new HelperJobFinished($this->id, $reference));
    }

    public function cancel(): void
    {
        $this->moveTo(JobStatus::Cancelled);
        $this->saveAndAssert();
        $this->raise(new HelperJobCancelled($this->id));
    }

    /**
     * Holds the job for repair on the stop evidence that failed the same way three times.
     */
    public function hold(string $stopEvidenceReference): void
    {
        $this->moveTo(JobStatus::Held);
        $this->stop_evidence_reference = $stopEvidenceReference;
        $this->saveAndAssert();
        $this->raise(new HelperJobHeld($this->id));
    }

    public function markUnfinished(string $stopEvidenceReference): void
    {
        $this->moveTo(JobStatus::Unfinished);
        $this->stop_evidence_reference = $stopEvidenceReference;
        $this->saveAndAssert();
        $this->raise(new HelperJobLeftUnfinished($this->id));
    }

    /**
     * The job's dispatch receipt, with the profile type it was started under and Core's start for it.
     */
    public function receipt(string $profileType, OwnerStartReceipt $start, bool $isNewJob): HelperReceipt
    {
        return new HelperReceipt(
            $this->helper_identity_id,
            $this->id,
            $isNewJob,
            $profileType,
            $this->status,
            $this->start_details,
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
        return $this->status->isFinal();
    }

    /**
     * The actor whose helper this job is, the parent that started it.
     */
    public function actor(): ActorReference
    {
        return ActorReference::fromStored($this->actor_type, $this->actor_id);
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
     * @return Attribute<SessionStartDetails, never>
     */
    protected function startDetails(): Attribute
    {
        return Accessor::get(fn () => new SessionStartDetails(
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
     * @throws HelperJobEnded
     */
    private function assertNotFinished(): void
    {
        if ($this->status->isFinal()) {
            throw HelperJobEnded::forJob($this->id, $this->status->value);
        }
    }

    // ----------[ Internals ]----------

    private function moveTo(JobStatus $status): void
    {
        $this->assertNotFinished();

        $this->status = $status;
    }

    // ----------[ Queries ]----------

    /**
     * Whether the helper already had a job of this purpose: the same subject, or the same named work.
     */
    public static function hasJobFor(HelperIdentity $identity, HelperPurpose $purpose): bool
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
    public static function findNewest(int $limit): Collection
    {
        return self::query()->acrossActors()->newestFirst()->limit($limit)->get();
    }

    /**
     * How many jobs of every helper are not yet finished, cancelled or failed.
     */
    public static function resolveOpenCount(): int
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
        $query->whereNotIn('status', array_map(
            fn (JobStatus $status) => $status->value,
            array_filter(JobStatus::cases(), fn (JobStatus $status) => $status->isFinal()),
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
                ->withSubjectType($subject->type)
                ->ofSubject($subject->id)
                ->keys())
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
        $query->whereIn('helper_purpose_id', HelperPurpose::query()->idsSameAs($purpose));
    }

    /**
     * The rows of the given request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRequest(Builder $query, string $requestId): void
    {
        $query->where('request_id', $requestId);
    }

    /**
     * The rows of the given helper purpose.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofHelperPurpose(Builder $query, string $purposeId): void
    {
        $query->where('helper_purpose_id', $purposeId);
    }

    /**
     * The rows of the given helper identity.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofHelperIdentity(Builder $query, string $identityId): void
    {
        $query->where('helper_identity_id', $identityId);
    }
}
