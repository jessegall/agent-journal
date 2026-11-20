<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperJobFinished;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One job a parent gave a helper for a purpose: its brief, the source it was given, how far it got, the steering added
 * on the way and where its result and stop evidence are. Only its parent reads it.
 *
 * @property string $id
 * @property string $helper_identity_id
 * @property string $helper_purpose_id
 * @property string $brief
 * @property array<string, mixed> $source_snapshot
 * @property string $request_id
 * @property JobState $state
 * @property list<string> $steering
 * @property string|null $result_reference
 * @property string|null $stop_evidence_reference
 * @property int $profile_revision
 * @property CarbonImmutable|null $finished_at
 */
#[Table('helper_jobs')]
#[Fillable(['brief', 'source_snapshot', 'request_id', 'state', 'steering', 'profile_revision'])]
final class HelperJob extends Model implements ReadableModel
{
    use BelongsToOneActor, BoundedReads, HasUlids;
    use Linkable;

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
        ];
    }

    /**
     * @param  array<string, mixed>  $sourceSnapshot
     */
    public static function accept(
        HelperIdentity $helper,
        HelperPurpose $purpose,
        ActorIdentity $parent,
        string $brief,
        array $sourceSnapshot,
        string $requestId,
        int $profileRevision,
    ): self {
        $job = new self();
        $job->helper_identity_id = $helper->id;
        $job->helper_purpose_id = $purpose->id;
        $job->brief = $brief;
        $job->source_snapshot = $sourceSnapshot;
        $job->request_id = $requestId;
        $job->state = JobState::Accepted;
        $job->steering = [];
        $job->profile_revision = $profileRevision;
        $job->belongTo($parent);
        $job->save();

        return $job;
    }

    public function addSteering(string $steering): void
    {
        $this->moveTo($this->state);
        $this->steering = [...$this->steering, $steering];
        $this->save();
    }

    public function finish(string $resultReference): void
    {
        $this->moveTo(JobState::Finished);
        $this->result_reference = $resultReference;
        $this->finished_at = CarbonImmutable::now();
        $this->save();
    }

    public function cancel(): void
    {
        $this->moveTo(JobState::Cancelled);
        $this->save();
    }

    public function hold(): void
    {
        $this->moveTo(JobState::Held);
        $this->save();
    }

    public function markUnfinished(string $stopEvidenceReference): void
    {
        $this->moveTo(JobState::Unfinished);
        $this->stop_evidence_reference = $stopEvidenceReference;
        $this->save();
    }

    private function moveTo(JobState $state): void
    {
        if ($this->state->isFinal()) {
            throw HelperJobFinished::forJob($this->id, $this->state->value);
        }

        $this->state = $state;
    }

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
