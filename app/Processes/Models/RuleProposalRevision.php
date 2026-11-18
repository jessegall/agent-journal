<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Processes\Casts\StoredValueCast;
use App\Processes\Casts\StoredValuesCast;
use App\Processes\Exceptions\RevisionImmutable;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ProposedRule;
use App\Processes\Values\RuleExample;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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
#[Fillable(['rule_proposal_id', 'revision', 'payload', 'evidence', 'examples', 'author_type', 'author_id'])]
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

    public function proposedRule(): ProposedRule
    {
        return new ProposedRule($this->payload, $this->evidence, $this->examples);
    }

    /**
     * @return BelongsTo<RuleProposal, $this>
     */
    public function proposal(): BelongsTo
    {
        return $this->belongsTo(RuleProposal::class, 'rule_proposal_id');
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => throw RevisionImmutable::proposal($revision->id));
    }

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
