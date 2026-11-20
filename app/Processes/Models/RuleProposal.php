<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Casts\RuleScopeCast;
use App\Processes\Casts\StoredValuesCast;
use App\Processes\Enums\ProposalState;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Values\ProposedRule;
use App\Processes\Values\RuleReference;
use App\Processes\Values\RuleScope;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * One proposed command declaration under review (doc 21 revision 6, section 51): its owner scope in one project, the
 * request it answers, the canonical program and operation, its state, its author, the exact rule revision it replaces
 * and its current revision. A request id is used once per author and project, bound to the payload it first sent.
 *
 * @property string $id
 * @property string $project_key
 * @property RuleScope $scope
 * @property string|null $command_request_id
 * @property string $program
 * @property string $operation
 * @property ProposalState $state
 * @property string $author_type
 * @property string $author_id
 * @property string $request_id
 * @property string $payload_digest
 * @property list<RuleReference> $replaces
 * @property int $current_revision
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'project_key',
    'scope',
    'command_request_id',
    'program',
    'operation',
    'state',
    'author_type',
    'author_id',
    'request_id',
    'payload_digest',
    'replaces',
    'current_revision',
])]
final class RuleProposal extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope' => RuleScopeCast::class,
            'state' => ProposalState::class,
            'replaces' => StoredValuesCast::class.':'.RuleReference::class,
            'current_revision' => 'integer',
        ];
    }

    /**
     * The proposal this author's request id opened in the project: the same one again when the payload is the same,
     * a new one with its first revision when the request id is new.
     *
     * @throws RuleProposalRefused when the request id already proposed another payload
     */
    public static function open(
        string $projectKey,
        ActorIdentity $author,
        string $requestId,
        ProposedRule $proposed,
        CommandRequest|null $answers,
    ): self {
        $existing = self::query()->ofProject($projectKey)->requestedBy($author, $requestId)->first();

        if ($existing !== null) {
            return $existing->sameRequest($proposed);
        }

        $proposal = self::query()->create([
            'project_key' => $projectKey,
            'scope' => $proposed->rule->scope,
            'command_request_id' => $answers?->id,
            'program' => $proposed->rule->programFamily(),
            'operation' => $proposed->rule->operation(),
            'state' => ProposalState::Draft,
            'author_type' => $author->type->value,
            'author_id' => $author->id,
            'request_id' => $requestId,
            'payload_digest' => $proposed->digest(),
            'replaces' => $proposed->rule->replaces,
            'current_revision' => 0,
        ]);
        $proposal->record($proposed, $author);

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

        if (! $this->state->canAcceptRevision()) {
            throw RuleProposalRefused::ended($this->id, $this->state);
        }

        $this->state = ProposalState::Withdrawn;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * The author adds the next revision to the revision they read; an approval of the earlier one no longer fits.
     *
     * @throws RuleProposalRefused
     */
    public function revise(int $expectedRevision, ProposedRule $proposed, ActorIdentity $author): RuleProposalRevision
    {
        $this->assertAuthor($author);

        if ($expectedRevision !== $this->current_revision) {
            throw RuleProposalRefused::stale($this->id, $expectedRevision, $this->current_revision);
        }

        return $this->record($proposed, $author);
    }

    /**
     * The owner approved the current revision; the proposal is ended.
     *
     * @throws RuleProposalRefused
     */
    public function approve(): void
    {
        $this->end(ProposalState::Approved);
    }

    /**
     * @throws RuleProposalRefused
     */
    public function reject(): void
    {
        $this->end(ProposalState::Rejected);
    }

    /**
     * @throws RuleProposalRefused
     */
    public function assertReviewable(int $expectedRevision): void
    {
        if ($this->state !== ProposalState::Pending) {
            throw RuleProposalRefused::notPending($this->id, $this->state);
        }

        if ($expectedRevision !== $this->current_revision) {
            throw RuleProposalRefused::stale($this->id, $expectedRevision, $this->current_revision);
        }
    }

    public function isAuthoredBy(ActorIdentity $actor): bool
    {
        return $this->author_type === $actor->type->value && $this->author_id === $actor->id;
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

    // ----------[ Internals ]----------

    /**
     * Adds the next revision; the proposal waits for review once a revision is complete and stays a draft until then.
     *
     * @throws RuleProposalRefused when the proposal is already ended
     */
    private function record(ProposedRule $proposed, ActorIdentity $author): RuleProposalRevision
    {
        if (! $this->state->canAcceptRevision()) {
            throw RuleProposalRefused::ended($this->id, $this->state);
        }

        $revision = $this->revisions()->create([
            'revision' => $this->current_revision + 1,
            'payload' => $proposed->rule,
            'evidence' => $proposed->evidence,
            'examples' => $proposed->examples,
            'author_type' => $author->type->value,
            'author_id' => $author->id,
        ]);
        $this->program = $proposed->rule->programFamily();
        $this->operation = $proposed->rule->operation();
        $this->replaces = $proposed->rule->replaces;
        $this->current_revision = $revision->revision;
        $this->state = $proposed->isComplete() ? ProposalState::Pending : ProposalState::Draft;
        $this->save();

        return $revision;
    }

    /**
     * @throws RuleProposalRefused
     */
    private function end(ProposalState $state): void
    {
        if (! $this->state->canAcceptRevision()) {
            throw RuleProposalRefused::ended($this->id, $this->state);
        }

        $this->state = $state;
        $this->save();
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

    /**
     * @throws RuleProposalRefused
     */
    private function sameRequest(ProposedRule $proposed): self
    {
        if ($this->payload_digest !== $proposed->digest()) {
            throw RuleProposalRefused::requestReused($this->request_id);
        }

        return $this;
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
        $query->where('author_type', $author->type->value)
            ->where('author_id', $author->id)
            ->where('request_id', $requestId);
    }
}
