<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Models\Support\HasActorColumns;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RequestState;
use App\Processes\Exceptions\RequestTransitionRefused;
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
 * @property RequestHoldReason $hold_reason
 * @property RequestState $state
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['project_key', 'actor_type', 'actor_id', 'operation', 'binding_digest', 'source_digest', 'source_excerpt', 'hold_reason', 'state'])]
final class CommandRequest extends Model implements ReadableModel
{
    use BoundedReads;
    use HasActorColumns, HasUlids, Linkable;

    public const int EXCERPT_LENGTH = 200;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['hold_reason' => RequestHoldReason::class, 'state' => RequestState::class];
    }

    public function nextStep(): NextStep
    {
        return $this->state->nextStep($this->id, $this->operation);
    }

    public function isOpenedBy(ActorIdentity $actor): bool
    {
        return $this->actor_type === $actor->type->value && $this->actor_id === $actor->id;
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function propose(): void
    {
        $this->moveTo(RequestState::AwaitingSampleApproval);
    }

    /**
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
     * The sample run ended without usable evidence; the owner's approval of one sample still stands.
     *
     * @throws RequestTransitionRefused
     */
    public function retrySample(): void
    {
        $this->moveTo(RequestState::ReadyForSample);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function prove(): void
    {
        $this->moveTo(RequestState::AwaitingApproval);
    }

    /**
     * @throws RequestTransitionRefused
     */
    public function approve(): void
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

    /**
     * @throws RequestTransitionRefused
     */
    private function moveTo(RequestState $next): void
    {
        if (! $this->state->allows($next)) {
            throw RequestTransitionRefused::from($this->state, $next, implode('; ', $this->nextStep()->obligations));
        }
        $this->state = $next;
        $this->save();
    }

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
        $query->whereNotIn('state', [RequestState::Active->value, RequestState::Rejected->value, RequestState::Withdrawn->value]);
    }
}
