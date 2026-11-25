<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Casts\StoredValueCast;
use App\Casts\StoredValuesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\RevisionImmutable;
use App\Support\ActorIdentity;
use App\Values\CommandRule;
use App\Values\ProposedRule;
use App\Values\RuleExample;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One revision of a rule proposal: the validated rule with its contract, the evidence and the examples, and who wrote
 * it. It is never updated after insert; a change is the proposal's next revision.
 *
 * @property string $id
 * @property string $rule_proposal_id
 * @property int $revision
 * @property CommandRule $payload
 * @property string $evidence
 * @property list<RuleExample> $examples
 * @property string $author_type
 * @property string $author_id
 * @property Carbon $created_at
 */
#[Fillable([
    'rule_proposal_id',
    'revision',
    'payload',
    'evidence',
    'examples',
    'author_type',
    'author_id',
])]
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
        return self::query()->create([
            'rule_proposal_id' => $proposal->id,
            'revision' => $proposal->current_revision + 1,
            'payload' => $proposed->rule,
            'evidence' => $proposed->evidence,
            'examples' => $proposed->examples,
            'author_type' => $author->type->value,
            'author_id' => $author->id,
        ]);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ProposedRule, never>
     */
    protected function proposedRule(): Attribute
    {
        return Attribute::get(
            fn () => new ProposedRule($this->payload, $this->evidence, $this->examples),
        )->withoutObjectCaching();
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
}
