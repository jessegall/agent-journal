<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\RevisionImmutable;
use App\Models\CommandRules\RuleProposalRevision;
use App\Support\ActorReference;
use App\Values\ProvenBranch;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $project_key
 * @property string $command_request_id
 * @property string $reader_revision_id
 * @property string $rule_proposal_revision_id
 * @property DataCollection<int, ProvenBranch> $proven_branches
 * @property string $actor_type
 * @property string $actor_id
 * @property CarbonImmutable $created_at
 *
 * @mixin \Eloquent
 */
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
        return ['proven_branches' => DataCollection::class.':'.ProvenBranch::class];
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
        ActorReference $prover,
    ): self {
        $readerProof = new self();
        $readerProof->project_key = $reader->project_key;
        $readerProof->command_request_id = $reader->command_request_id;
        $readerProof->reader_revision_id = $reader->id;
        $readerProof->rule_proposal_revision_id = $declaration->id;
        $readerProof->proven_branches = ProvenBranch::collect($branches, DataCollection::class);
        $readerProof->actor_type = $prover->type;
        $readerProof->actor_id = $prover->id;
        $readerProof->save();

        return $readerProof;
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
    protected function ofReaderRevision(Builder $query, string $revisionId): void
    {
        $query->where('reader_revision_id', $revisionId);
    }
}
