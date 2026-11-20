<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Casts\StoredValuesCast;
use App\Processes\Exceptions\RevisionImmutable;
use App\Processes\Values\ProvenBranch;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The journal's proof that one reader revision reads one declaration revision's output (doc 21 revision 6, sections
 * 71 and 72): the real sample runs it replayed the reader over, one per exit branch, with their manifests. It is never
 * updated; another reader or declaration revision needs a proof of its own (story 188).
 *
 * @property string $id
 * @property string $project_key
 * @property string $command_request_id
 * @property string $reader_revision_id
 * @property string $rule_proposal_revision_id
 * @property list<ProvenBranch> $proven_branches
 * @property string $actor_type
 * @property string $actor_id
 * @property Carbon $created_at
 */
#[Fillable([
    'project_key',
    'command_request_id',
    'reader_revision_id',
    'rule_proposal_revision_id',
    'proven_branches',
    'actor_type',
    'actor_id',
])]
final class ReaderProof extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['proven_branches' => StoredValuesCast::class.':'.ProvenBranch::class];
    }

    /**
     * @param  list<ProvenBranch>  $branches
     */
    public static function record(
        ReaderRevision $reader,
        RuleProposalRevision $declaration,
        array $branches,
        ActorIdentity $prover,
    ): self {
        return self::query()->create([
            'project_key' => $reader->project_key,
            'command_request_id' => $reader->command_request_id,
            'reader_revision_id' => $reader->id,
            'rule_proposal_revision_id' => $declaration->id,
            'proven_branches' => $branches,
            'actor_type' => $prover->type->value,
            'actor_id' => $prover->id,
        ]);
    }

    protected static function booted(): void
    {
        self::updating(fn (self $proof) => throw RevisionImmutable::proof($proof->id));
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
}
