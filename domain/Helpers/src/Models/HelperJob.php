<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Support\OwnerStartReceipt;
use App\Assignments\Contracts\Assignable;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperJobFinished;
use Domain\Helpers\Support\HelperReceipt;
use Domain\Helpers\Support\JobLaunch;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
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
 * @property array{subjects: list<string>} $source_snapshot
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
#[Fillable(['brief', 'source_snapshot', 'request_id', 'state', 'steering', 'profile_revision'])]
final class HelperJob extends Model implements Assignable, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'helpers.job';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => JobState::class,
            'source_snapshot' => 'array',
            'steering' => 'array',
            'finished_at' => 'immutable_datetime',
            'identity_new' => 'boolean',
            'independent' => 'boolean',
            'conversation_mode' => ConversationModeType::class,
        ];
    }

    /**
     * @param  array{subjects: list<string>}  $sourceSnapshot
     */
    public static function create(
        HelperIdentity $helper,
        HelperPurpose $purpose,
        ActorIdentity $parent,
        string $brief,
        array $sourceSnapshot,
        JobLaunch $launch,
    ): self {
        $job = new self();
        $job->helper_identity_id = $helper->id;
        $job->helper_purpose_id = $purpose->id;
        $job->brief = $brief;
        $job->source_snapshot = $sourceSnapshot;
        $job->request_id = $launch->requestId;
        $job->payload_digest = $launch->payloadDigest;
        $job->profile_revision = $launch->profileRevision;
        $job->identity_new = $launch->isNewIdentity;
        $job->independent = $launch->independent;
        $job->conversation_mode = $launch->conversationMode;
        $job->conversation_reason = $launch->conversationReason;
        $job->state = JobState::Accepted;
        $job->steering = [];
        $job->belongTo($parent);
        $job->save();

        return $job;
    }

    // ----------[ Queries ]----------

    /**
     * Whether the helper already had a job of this purpose: the same subject, or the same named work.
     */
    public static function existsFor(HelperIdentity $identity, HelperPurpose $purpose): bool
    {
        return self::query()->acrossActors()
            ->where('helper_identity_id', $identity->id)
            ->whereIn('helper_purpose_id', HelperPurpose::sameAs($purpose)->select('id'))
            ->exists();
    }

    /**
     * The newest jobs of every helper, at most the limit, newest first.
     *
     * @return Collection<int, self>
     */
    public static function newest(int $limit): Collection
    {
        return self::query()->acrossActors()->latest()->orderByDesc('id')->limit($limit)->get();
    }

    /**
     * How many jobs of every helper are not yet finished, cancelled or failed.
     */
    public static function openCount(): int
    {
        return self::query()->acrossActors()->open()->count();
    }

    // ----------[ Mutations ]----------

    /**
     * Opens the unfinished job for another attempt; its brief, purpose, steering and source stay.
     */
    public function reopenForAttempt(): void
    {
        $this->moveTo(JobState::Accepted);
        $this->save();
    }

    /**
     * Opens finished, reviewed work again for repair on the same helper and checkout: its history and certificate
     * stay, the findings join its steering, and it is unfinished until a new stop certifies it.
     */
    public function reopenForRepair(string $findings): void
    {
        $this->state = JobState::Accepted;
        $this->finished_at = null;
        $this->steering = [...$this->steering, $findings];
        $this->save();
    }

    public function addSteering(string $steering): void
    {
        $this->moveTo($this->state);
        $this->steering = [...$this->steering, $steering];
        $this->save();
    }

    /**
     * Finishes the job on the stop evidence that certified its work complete.
     */
    public function finish(string $reference): void
    {
        $this->moveTo(JobState::Finished);
        $this->stop_evidence_reference = $reference;
        $this->finished_at = CarbonImmutable::now();
        $this->save();
    }

    public function cancel(): void
    {
        $this->moveTo(JobState::Cancelled);
        $this->save();
    }

    /**
     * Holds the job for repair on the stop evidence that failed the same way three times.
     */
    public function hold(string $stopEvidenceReference): void
    {
        $this->moveTo(JobState::Held);
        $this->stop_evidence_reference = $stopEvidenceReference;
        $this->save();
    }

    public function markUnfinished(string $stopEvidenceReference): void
    {
        $this->moveTo(JobState::Unfinished);
        $this->stop_evidence_reference = $stopEvidenceReference;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * The actor whose helper this job is, the parent that started it.
     */
    public function actor(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id);
    }

    public function launch(): JobLaunch
    {
        return new JobLaunch(
            $this->request_id,
            $this->payload_digest,
            $this->profile_revision,
            $this->identity_new,
            $this->independent,
            $this->conversation_mode,
            $this->conversation_reason,
        );
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
            $this->launch(),
            $start,
        );
    }

    /**
     * The records the job was given as its source, written as type:id.
     *
     * @return list<string>
     */
    public function sourceSubjects(): array
    {
        return $this->source_snapshot['subjects'];
    }

    /**
     * What the helper working this job must be told when its context starts: who it is, the purpose, the whole brief,
     * the steering so far and the records it was given.
     */
    public function contextFor(HelperIdentity $identity, string $purposeLabel): string
    {
        $lines = [
            sprintf(
                'You are helper %s (profile %s, revision %d), on job %s for: %s',
                $identity->id,
                $identity->profile_key,
                $this->profile_revision,
                $this->id,
                $purposeLabel,
            ),
            'Your brief:',
            $this->brief,
        ];

        foreach ($this->steering as $steering) {
            $lines[] = "Steering from your parent: {$steering}";
        }

        foreach ($this->sourceSubjects() as $subject) {
            $lines[] = "Given as your source: {$subject}";
        }

        return implode(PHP_EOL, $lines);
    }

    public function wasDispatchedAs(string $payloadDigest): bool
    {
        return $this->payload_digest === $payloadDigest;
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    public function isFinished(): bool
    {
        return $this->state->isFinal();
    }

    // ----------[ Internals ]----------

    private function moveTo(JobState $state): void
    {
        if ($this->state->isFinal()) {
            throw HelperJobFinished::forJob($this->id, $this->state->value);
        }

        $this->state = $state;
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
            ->orWhereJsonContains('source_snapshot->subjects', sprintf('%s:%s', $subject->type, $subject->id)));
    }
}
