<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Casts\StoredValueCast;
use App\Casts\StoredValuesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\RevisionImmutable;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use App\Values\CommandRule;
use App\Values\ProposedRule;
use App\Values\RuleExample;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $rule_proposal_id
 * @property int $revision
 * @property StoredValueCast<array-key, CommandRule>|CommandRule[] $payload
 * @property string $evidence
 * @property StoredValuesCast<array-key, RuleExample>|RuleExample[] $examples
 * @property string $author_type
 * @property string $author_id
 * @property Carbon $created_at
 * @property mixed $proposed_rule attribute
 * @property RuleProposal $proposal
 */
final class RuleProposalRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'revision' => 'integer',
            'payload' => StoredValueCast::class.':'.CommandRule::class,
            'examples' => StoredValuesCast::class.':'.RuleExample::class,
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => $revision->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * The proposal's next revision of the proposed rule, by its author.
     */
    public static function create(RuleProposal $proposal, ProposedRule $proposed, ActorIdentity $author): self
    {
        $ruleProposalRevision = new self();
        $ruleProposalRevision->rule_proposal_id = $proposal->id;
        $ruleProposalRevision->revision = $proposal->current_revision + 1;
        $ruleProposalRevision->payload = $proposed->rule;
        $ruleProposalRevision->evidence = $proposed->evidence;
        $ruleProposalRevision->examples = $proposed->examples;
        $ruleProposalRevision->author_type = $author->type->value;
        $ruleProposalRevision->author_id = $author->id;
        $ruleProposalRevision->save();

        return $ruleProposalRevision;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ProposedRule, never>
     */
    protected function proposedRule(): Attribute
    {
        return Accessor::get(fn () => new ProposedRule($this->payload, $this->evidence, $this->examples));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<RuleProposal, $this>
     */
    public function proposal(): BelongsTo
    {
        return $this->belongsTo(RuleProposal::class, 'rule_proposal_id');
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: a revision stays as it was written.
     *
     * @throws RevisionImmutable
     */
    private function assertUnedited(): never
    {
        throw RevisionImmutable::proposal($this->id);
    }

    // ----------[ Scopes ]----------

    /**
     * The revision of the proposal that answers the request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function answering(Builder $query, CommandRequest $request, int $revision): void
    {
        $query->whereRelation('proposal', 'command_request_id', $request->id)->where('revision', $revision);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->whereRelation('proposal', 'project_key', $projectKey);
    }

    /**
     * The revision of the given number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function numbered(Builder $query, int $revision): void
    {
        $query->where('revision', $revision);
    }

    /**
     * The revisions, the newest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestRevisionFirst(Builder $query): void
    {
        $query->orderByDesc('revision');
    }
}
