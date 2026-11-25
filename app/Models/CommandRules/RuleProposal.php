<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Casts\RuleScopeCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\CommandRules\ProposalStatus;
use App\Events\Processes\RuleProposalAdopted;
use App\Events\Processes\RuleProposalApproved;
use App\Events\Processes\RuleProposalRejected;
use App\Events\Processes\RuleProposalWithdrawn;
use App\Exceptions\RuleProposalRefused;
use App\Support\ActorIdentity;
use App\Values\ProposedRule;
use App\Values\RuleReference;
use App\Values\RuleScope;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $project_key
 * @property string $scope_type
 * @property string $scope_owner
 * @property string $scope_version
 * @property string|null $command_request_id
 * @property string $program
 * @property string $operation
 * @property ProposalStatus $status
 * @property string $author_type
 * @property string $author_id
 * @property string $request_id
 * @property string $payload_digest
 * @property DataCollection<int, RuleReference> $replaces
 * @property int $current_revision
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property RuleScope $scope
 * @property-read CommandRequest|null $commandRequest
 * @property-read Collection<int, RuleProposalRevision> $revisions
 * @property-read int|null $revisions_count
 *
 * @mixin \Eloquent
 */
final class RuleProposal extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope' => RuleScopeCast::class,
            'status' => ProposalStatus::class,
            'replaces' => DataCollection::class.':'.RuleReference::class,
            'current_revision' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The proposal this author's request id opened in the project: the same one again when the payload is the same,
     * a new one with its first revision when the request id is new.
     *
     * @throws RuleProposalRefused when the request id already proposed another payload
     */
    public static function create(
        string $projectKey,
        ActorIdentity $author,
        string $requestId,
        ProposedRule $proposed,
        CommandRequest|null $answers,
    ): self {
        $existing = self::findRequestedBy($projectKey, $author, $requestId);

        if ($existing !== null) {
            $existing->assertSameRequest($proposed);

            return $existing;
        }

        $proposal = new self();
        $proposal->project_key = $projectKey;
        $proposal->scope = $proposed->rule->scope;
        $proposal->command_request_id = $answers?->id;
        $proposal->program = $proposed->rule->programFamily();
        $proposal->operation = $proposed->rule->operation();
        $proposal->status = ProposalStatus::Draft;
        $proposal->author_type = $author->type;
        $proposal->author_id = $author->id;
        $proposal->request_id = $requestId;
        $proposal->payload_digest = $proposed->digest();
        $proposal->replaces = RuleReference::collect($proposed->rule->replaces, DataCollection::class);
        $proposal->current_revision = 0;
        $proposal->assertSaved($proposal->save());

        return $proposal;
    }

    // ----------[ Mutations ]----------

    /**
     * The author takes the proposal back; it stays readable as history.
     *
     * @throws RuleProposalRefused
     */
    public function withdraw(ActorIdentity $author): void
    {
        $this->assertAuthor($author);
        $this->assertOpen();

        $this->status = ProposalStatus::Withdrawn;
        $this->assertSaved($this->save());
        $this->raise(new RuleProposalWithdrawn($this->id));
    }

    /**
     * Makes the revision just written the proposal's current one, with the rule's program and state: the proposal
     * waits for review once a revision is complete and stays a draft until then.
     */
    public function adopt(RuleProposalRevision $revision, ProposedRule $proposed): void
    {
        $this->program = $proposed->rule->programFamily();
        $this->operation = $proposed->rule->operation();
        $this->replaces = RuleReference::collect($proposed->rule->replaces, DataCollection::class);
        $this->current_revision = $revision->revision;
        $this->status = $proposed->isComplete() ? ProposalStatus::Pending : ProposalStatus::Draft;
        $this->assertSaved($this->save());
        $this->raise(new RuleProposalAdopted($this->id));
    }

    /**
     * The owner approved the current revision; the proposal is ended.
     *
     * @throws RuleProposalRefused
     */
    public function approve(): void
    {
        $this->end(ProposalStatus::Approved);
        $this->raise(new RuleProposalApproved($this->id));
    }

    /**
     * @throws RuleProposalRefused
     */
    public function reject(): void
    {
        $this->end(ProposalStatus::Rejected);
        $this->raise(new RuleProposalRejected($this->id));
    }

    // ----------[ Predicates ]----------

    public function isAuthoredBy(ActorIdentity $actor): bool
    {
        return $this->author_type === $actor->type && $this->author_id === $actor->id;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<CommandRequest, $this>
     */
    public function commandRequest(): BelongsTo
    {
        return $this->belongsTo(CommandRequest::class);
    }

    /**
     * @return HasMany<RuleProposalRevision, $this>
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(RuleProposalRevision::class);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a revision by anyone but the author, or made against a revision that is no longer current.
     *
     * @throws RuleProposalRefused
     */
    public function assertRevisableAt(int $expectedRevision, ActorIdentity $author): void
    {
        $this->assertAuthor($author);

        if ($expectedRevision !== $this->current_revision) {
            throw RuleProposalRefused::stale($this->id, $expectedRevision, $this->current_revision);
        }
    }

    /**
     * Refuses a revision once the proposal ended.
     *
     * @throws RuleProposalRefused
     */
    public function assertAcceptsRevision(): void
    {
        if (! $this->status->canAcceptRevision()) {
            throw RuleProposalRefused::ended($this->id, $this->status);
        }
    }

    /**
     * @throws RuleProposalRefused
     */
    public function assertReviewable(int $expectedRevision): void
    {
        if ($this->status !== ProposalStatus::Pending) {
            throw RuleProposalRefused::notPending($this->id, $this->status);
        }

        if ($expectedRevision !== $this->current_revision) {
            throw RuleProposalRefused::stale($this->id, $expectedRevision, $this->current_revision);
        }
    }

    /**
     * Refuses a change to a proposal that already ended.
     *
     * @throws RuleProposalRefused
     */
    private function assertOpen(): void
    {
        if (! $this->status->canAcceptRevision()) {
            throw RuleProposalRefused::ended($this->id, $this->status);
        }
    }

    /**
     * Refuses a request key used again for another proposal.
     *
     * @throws RuleProposalRefused
     */
    private function assertSameRequest(ProposedRule $proposed): void
    {
        if ($this->payload_digest !== $proposed->digest()) {
            throw RuleProposalRefused::requestReused($this->request_id);
        }
    }

    /**
     * @throws RuleProposalRefused
     */
    private function assertAuthor(ActorIdentity $actor): void
    {
        if (! $this->isAuthoredBy($actor)) {
            throw RuleProposalRefused::notTheAuthor($this->id);
        }
    }

    // ----------[ Internals ]----------

    /**
     * @throws RuleProposalRefused
     */
    private function end(ProposalStatus $state): void
    {
        $this->assertOpen();

        $this->status = $state;
        $this->save();
    }

    // ----------[ Queries ]----------

    /**
     * The proposal this author's request made in the project; none before it.
     */
    public static function findRequestedBy(string $projectKey, ActorIdentity $author, string $requestId): self|null
    {
        return self::query()->ofProject($projectKey)->requestedBy($author, $requestId)->first();
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
    protected function requestedBy(Builder $query, ActorIdentity $author, string $requestId): void
    {
        $query->where('author_type', $author->type)
            ->where('author_id', $author->id)
            ->where('request_id', $requestId);
    }

    /**
     * The rows of the given command request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofCommandRequest(Builder $query, string $requestId): void
    {
        $query->where('command_request_id', $requestId);
    }

    /**
     * The rows of any of the given states.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, ProposalStatus>|Builder<covariant Model>|Closure  $states
     */
    #[Scope]
    protected function withAnyState(Builder $query, array|Builder|Closure $states): void
    {
        $query->whereIn('status', $states);
    }
}
