<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Models\Support\HasActorColumns;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Enums\EvidenceSource;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\ProposalState;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RequestState;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Values\ExitBranch;
use App\Processes\Values\ExitPolicy;
use App\Processes\Values\NextStep;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One persistent request that holds a command the journal will not run yet (doc 21 revision 6, section 71): scoped to
 * a project, the actor who opened it and one canonical operation and binding, it names what is still owed and the
 * next allowed command. It is read from the database every time, never from a session, and it changes state only
 * through its transition methods; there is no transition for a timeout, a skip, an unreadable mark or a waiver.
 *
 * @property string $id
 * @property string $project_key
 * @property string $actor_type
 * @property string $actor_id
 * @property string $operation
 * @property string $binding_digest
 * @property string $source_digest
 * @property string $source_excerpt
 * @property string $source_line
 * @property string $working_folder
 * @property RequestHoldReason $hold_reason
 * @property RequestState $state
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'project_key',
    'actor_type',
    'actor_id',
    'operation',
    'binding_digest',
    'source_digest',
    'source_excerpt',
    'source_line',
    'working_folder',
    'hold_reason',
    'state',
])]
final class CommandRequest extends Model implements ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasActorColumns;
    use HasUlids;
    use Linkable;

    public const int EXCERPT_LENGTH = 200;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['hold_reason' => RequestHoldReason::class, 'state' => RequestState::class];
    }

    /**
     * A new request holding the actor's command line in the project, collecting its declaration first.
     */
    public static function open(string $projectKey, ActorIdentity $actor, OpenCommandRequest $command): self
    {
        return self::query()->create([
            'project_key' => $projectKey,
            'actor_type' => $actor->type->value,
            'actor_id' => $actor->id,
            'operation' => $command->operation,
            'binding_digest' => $command->bindingDigest,
            'source_digest' => hash('sha256', $command->line),
            'source_excerpt' => self::excerptOf($command->line),
            'source_line' => $command->line,
            'working_folder' => $command->workingFolder,
            'hold_reason' => $command->reason,
            'state' => RequestState::CollectingDeclaration,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The line as a request shows it: control bytes as spaces, cut to the excerpt length.
     */
    public static function excerptOf(string $line): string
    {
        return mb_substr((string) preg_replace('/[\x00-\x1F\x7F]/', ' ', $line), 0, self::EXCERPT_LENGTH);
    }

    /**
     * The request with that id, locked for the change about to be made to it.
     */
    public static function lockedForChange(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->sole();
    }

    // ----------[ Answers ]----------

    public function nextStep(): NextStep
    {
        return $this->state->nextStep($this->id, $this->operation);
    }

    /**
     * Whether the request waits for a proven reader, the one state a proof may be given in.
     */
    public function awaitsProof(): bool
    {
        return $this->state === RequestState::AwaitingProof;
    }

    /**
     * Whether the request's actor read the run's envelope and at least one range of every stream its parts wrote,
     * as a reader must be proven only against evidence its author looked at (story 202).
     */
    public function hasReadEvidence(ProcessRun $run): bool
    {
        $reads = EvidenceRead::query()->ofRunReadBy($run, $this->actor())->readLimit(1_000)->get();

        if (! $reads->contains(fn (EvidenceRead $read): bool => $read->source === EvidenceSource::Envelope)) {
            return false;
        }

        return $run->parts()->readLimit(500)->get()->every(fn (PartRun $part): bool => array_all(
            $part->recordedStreams(),
            fn (OutputStream $stream): bool => $reads->contains(
                fn (EvidenceRead $read): bool => $read->part_run_id === $part->id
                    && $read->source === EvidenceSource::of($stream),
            ),
        ));
    }

    /**
     * The exit branches of the contract that no complete sample of this request ended with yet (story 185).
     *
     * @return list<ExitBranch>
     */
    public function unsampledBranches(ExitPolicy $exits): array
    {
        $runs = EvidencePermit::query()->sampling($this)->readLimit(100)->pluck('process_run_id')->all();
        $statuses = PartRun::query()
            ->whereIn('process_run_id', $runs)
            ->where('operation', $this->operation)
            ->readLimit(500)
            ->get()
            ->filter(fn (PartRun $part): bool => $part->end()->hasStatus())
            ->map(fn (PartRun $part): int => $part->end_code)
            ->all();

        return $exits->branchesMissing(array_values($statuses));
    }

    /**
     * Whether the actor may propose for the request: the actor that opened it, or one that administers processes.
     */
    public function acceptsProposalFrom(ActorIdentity $actor, bool $administers): bool
    {
        return $administers || $this->isByActor($actor);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function propose(): void
    {
        $this->moveTo(RequestState::AwaitingSampleApproval);
    }

    /**
     * The owner approves one more sample: the first, or one for an exit branch the earlier samples did not reach.
     *
     * @throws RequestTransitionRefused
     */
    public function approveSample(): void
    {
        $this->moveTo(RequestState::ReadyForSample);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function startSample(): void
    {
        $this->moveTo(RequestState::CapturingSample);
    }

    /**
     * The sample run ended with evidence to prove a reader against.
     *
     * @throws RequestTransitionRefused
     */
    public function finishSample(): void
    {
        $this->moveTo(RequestState::AwaitingProof);
    }

    /**
     * The sample run ended without usable evidence; another sample needs the owner's explicit approval again.
     *
     * @throws RequestTransitionRefused
     */
    public function retrySample(): void
    {
        $this->moveTo(RequestState::AwaitingSampleApproval);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function prove(): void
    {
        $this->moveTo(RequestState::AwaitingApproval);
    }

    /**
     * The owner approved a test, check or build with its proven reader; only a proven request awaits that.
     *
     * @throws RequestTransitionRefused
     */
    public function approve(): void
    {
        if ($this->state !== RequestState::AwaitingApproval) {
            throw $this->refusal(RequestState::Active);
        }

        $this->moveTo(RequestState::Active);
    }

    /**
     * The owner approved a declaration that is no test, check or build: it needs no reader, so no sample or proof.
     *
     * @throws RequestTransitionRefused
     */
    public function approveOrdinary(): void
    {
        $this->moveTo(RequestState::Active);
    }

    /**
     * A revised declaration or reader starts the collection again; earlier samples and proofs stay recorded.
     *
     * @throws RequestTransitionRefused
     */
    public function revise(): void
    {
        $this->moveTo(RequestState::CollectingDeclaration);
    }

    /**
     * A new proposal revision answers the request: a revision after a sample or proof starts the collection again,
     * and a complete one moves the request on to its evidence sample.
     *
     * @throws RequestTransitionRefused
     */
    public function answerWith(RuleProposal $proposal): void
    {
        if ($this->state->restartsCollection()) {
            $this->revise();
        }

        if ($this->state === RequestState::CollectingDeclaration && $proposal->state === ProposalState::Pending) {
            $this->propose();
        }
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function reject(): void
    {
        $this->moveTo(RequestState::Rejected);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function withdraw(): void
    {
        $this->moveTo(RequestState::Withdrawn);
    }

    // ----------[ Internals ]----------

    /**
     * @throws RequestTransitionRefused
     */
    private function moveTo(RequestState $next): void
    {
        if (! $this->state->allows($next)) {
            throw $this->refusal($next);
        }

        $this->state = $next;
        $this->save();
    }

    private function refusal(RequestState $next): RequestTransitionRefused
    {
        return RequestTransitionRefused::from($this->state, $next, implode('; ', $this->nextStep()->steps));
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forOperation(Builder $query, string $operation, string $bindingDigest): void
    {
        $query->where('operation', $operation)->where('binding_digest', $bindingDigest);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function stillOpen(Builder $query): void
    {
        $query->whereNotIn('state', [
            RequestState::Active->value,
            RequestState::Rejected->value,
            RequestState::Withdrawn->value,
        ]);
    }
}
