<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Casts\StoredValuesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\RevisionImmutable;
use App\Models\CommandRules\RuleProposalRevision;
use App\Support\ActorIdentity;
use App\Values\ProvenBranch;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $project_key
 * @property string $command_request_id
 * @property string $reader_revision_id
 * @property string $rule_proposal_revision_id
 * @property StoredValuesCast<array-key, ProvenBranch>|ProvenBranch[] $proven_branches
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

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['proven_branches' => StoredValuesCast::class.':'.ProvenBranch::class];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $proof) => $proof->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * @param  list<ProvenBranch>  $branches
     */
    public static function create(
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

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: it stays as it was written.
     *
     * @throws RevisionImmutable
     */
    private function assertUnedited(): never
    {
        throw RevisionImmutable::proof($this->id);
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
     * The rows of the given reader revision.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofReaderRevision(Builder $query, string $readerRevisionId): void
    {
        $query->where('reader_revision_id', $readerRevisionId);
    }
}
