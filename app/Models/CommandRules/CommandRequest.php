<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\CommandRules\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\CommandRules\Enums\EvidenceSource;
use App\CommandRules\Enums\ProposalStatus;
use App\CommandRules\Enums\RequestHoldReason;
use App\CommandRules\Enums\RequestStatus;
use App\CommandRules\Exceptions\RequestTransitionRefused;
use App\CommandRules\Values\ExitBranch;
use App\CommandRules\Values\ExitPolicy;
use App\CommandRules\Values\NextStep;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Projects\Project;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Models\Support\Accessor;
use App\Models\Support\HasActorColumns;
use App\Models\Support\JournalModel;
use App\Models\Support\ProjectMembership;
use App\Processes\Enums\OutputStream;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $project_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $operation
 * @property string $binding_digest
 * @property string $source_digest
 * @property string $source_excerpt
 * @property string $source_line
 * @property string $working_folder
 * @property RequestHoldReason $hold_reason
 * @property RequestStatus $status
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $next_step
 *
 * @mixin \Eloquent
 */
final class CommandRequest extends JournalModel implements ProjectOwned, ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasActorColumns;
    use Linkable;
    use ProjectMembership;

    public const int EXCERPT_LENGTH = 200;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'hold_reason' => RequestHoldReason::class,
            'status' => RequestStatus::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new request holding the actor's command line in the project, collecting its declaration first.
     */
    public static function create(Project $project, ActorReference $actor, OpenCommandRequestCommand $command): self
    {
        $commandRequest = new self();
        $commandRequest->project_id = $project->id;
        $commandRequest->actor_type = $actor->type;
        $commandRequest->actor_id = $actor->id;
        $commandRequest->operation = $command->operation;
        $commandRequest->binding_digest = $command->bindingDigest;
        $commandRequest->source_digest = hash('sha256', $command->line);
        $commandRequest->source_excerpt = self::resolveExcerptOf($command->line);
        $commandRequest->source_line = $command->line;
        $commandRequest->working_folder = $command->workingFolder;
        $commandRequest->hold_reason = $command->reason;
        $commandRequest->status = RequestStatus::CollectingDeclaration;
        $commandRequest->save();

        return $commandRequest;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<NextStep, never>
     */
    protected function nextStep(): Attribute
    {
        return Accessor::get(fn () => $this->status->nextStep($this->id, $this->operation));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an approval of a request that does not wait for one.
     */
    private function assertAwaitingApproval(): void
    {
        if ($this->status !== RequestStatus::AwaitingApproval) {
            throw $this->refusal(RequestStatus::Active);
        }
    }

    /**
     * Refuses a move its present state does not allow.
     */
    private function assertMoveAllowed(RequestStatus $next): void
    {
        if (! $this->status->allows($next)) {
            throw $this->refusal($next);
        }
    }

    // ----------[ Internals ]----------

    /**
     * @throws RequestTransitionRefused
     */
    private function moveTo(RequestStatus $next): void
    {
        $this->assertMoveAllowed($next);

        $this->status = $next;
        $this->save();
    }

    private function refusal(RequestStatus $next): RequestTransitionRefused
    {
        return RequestTransitionRefused::from($this->status, $next, implode('; ', $this->next_step->steps));
    }

    // ----------[ Queries ]----------

    /**
     * The line as a request shows it: control bytes as spaces, cut to the excerpt length.
     */
    public static function resolveExcerptOf(string $line): string
    {
        return mb_substr((string) preg_replace('/[\x00-\x1F\x7F]/', ' ', $line), 0, self::EXCERPT_LENGTH);
    }

    /**
     * The request with that id, locked for the change about to be made to it.
     */
    public static function findLockedForChange(string $id): self
    {
        return self::query()->with('project')->whereKey($id)->lockForUpdate()->sole();
    }

    /**
     * Whether the request waits for a proven reader, the one state a proof may be given in.
     */
    public function awaitsProof(): bool
    {
        return $this->status === RequestStatus::AwaitingProof;
    }

    /**
     * Whether the request's actor read the run's envelope and at least one range of every stream its parts wrote,
     * as a reader must be proven only against evidence its author looked at (story 202).
     */
    public function hasReadEvidence(ProcessRun $run): bool
    {
        $reads = EvidenceRead::query()->ofRunReadBy($run, $this->actor())->limit(1_000)->get();

        if (! $reads->contains(fn (EvidenceRead $read) => $read->source === EvidenceSource::Envelope)) {
            return false;
        }

        return $run->parts()->limit(ProcessRun::PART_LIMIT)->get()->every(fn (PartRun $part) => array_all(
            $part->recordedStreams(),
            fn (OutputStream $stream): bool => $reads->contains(
                fn (EvidenceRead $read) => $read->part_run_id === $part->id
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
        $permits = EvidencePermit::query()->sampling($this)->limit(100)->get();
        $runIds = $permits->map(fn (EvidencePermit $permit): string|null => $permit->process_run_id)->all();
        $runs = array_filter($runIds);

        $statuses = PartRun::query()
            ->ofRuns($runs)
            ->ofOperation($this->operation)
            ->limit(500)
            ->get()
            ->filter(fn (PartRun $part): bool => $part->end->hasStatus())
            ->map(fn (PartRun $part): int => $part->end_code)
            ->all();

        return $exits->branchesMissing(array_values($statuses));
    }

    /**
     * Whether the actor may propose for the request: the actor that opened it, or one that administers processes.
     */
    public function acceptsProposalFrom(ActorReference $actor, bool $administers): bool
    {
        return $administers || $this->isByActor($actor);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function propose(): void
    {
        $this->moveTo(RequestStatus::AwaitingSampleApproval);
    }

    /**
     * The owner approves one more sample: the first, or one for an exit branch the earlier samples did not reach.
     *
     * @throws RequestTransitionRefused
     */
    public function approveSample(): void
    {
        $this->moveTo(RequestStatus::ReadyForSample);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function startSample(): void
    {
        $this->moveTo(RequestStatus::CapturingSample);
    }

    /**
     * The sample run ended with evidence to prove a reader against.
     *
     * @throws RequestTransitionRefused
     */
    public function finishSample(): void
    {
        $this->moveTo(RequestStatus::AwaitingProof);
    }

    /**
     * The sample run ended without usable evidence; another sample needs the owner's explicit approval again.
     *
     * @throws RequestTransitionRefused
     */
    public function retrySample(): void
    {
        $this->moveTo(RequestStatus::AwaitingSampleApproval);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function prove(): void
    {
        $this->moveTo(RequestStatus::AwaitingApproval);
    }

    /**
     * The owner approved a test, check or build with its proven reader; only a proven request awaits that.
     *
     * @throws RequestTransitionRefused
     */
    public function approve(): void
    {
        $this->assertAwaitingApproval();
        $this->moveTo(RequestStatus::Active);
    }

    /**
     * The owner approved a declaration that is no test, check or build: it needs no reader, so no sample or proof.
     *
     * @throws RequestTransitionRefused
     */
    public function approveOrdinary(): void
    {
        $this->moveTo(RequestStatus::Active);
    }

    /**
     * A revised declaration or reader starts the collection again; earlier samples and proofs stay recorded.
     *
     * @throws RequestTransitionRefused
     */
    public function revise(): void
    {
        $this->moveTo(RequestStatus::CollectingDeclaration);
    }

    /**
     * A new proposal revision answers the request: a revision after a sample or proof starts the collection again,
     * and a complete one moves the request on to its evidence sample.
     *
     * @throws RequestTransitionRefused
     */
    public function answerWith(RuleProposal $proposal): void
    {
        if ($this->status->restartsCollection()) {
            $this->revise();
        }

        if ($this->status === RequestStatus::CollectingDeclaration && $proposal->status === ProposalStatus::Pending) {
            $this->propose();
        }
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function reject(): void
    {
        $this->moveTo(RequestStatus::Rejected);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function withdraw(): void
    {
        $this->moveTo(RequestStatus::Withdrawn);
    }

    // ----------[ Scopes ]----------

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
        $query->whereNotIn('status', [
            RequestStatus::Active->value,
            RequestStatus::Rejected->value,
            RequestStatus::Withdrawn->value,
        ]);
    }
}
