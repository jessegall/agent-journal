<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Casts\RuleScopeCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\RevisionImmutable;
use App\Exceptions\RuleRevisionInvalid;
use App\Models\Support\NamedByRuleScope;
use App\Support\ActorIdentity;
use App\Values\CommandRule;
use App\Values\ReaderApproval;
use App\Values\ScriptBinding;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $project_key
 * @property string $scope_type
 * @property string $scope_owner
 * @property string $scope_version
 * @property string $rule_id
 * @property int $revision
 * @property string $rule_proposal_revision_id
 * @property CommandRule $payload
 * @property DataCollection<int, ScriptBinding> $script_bindings
 * @property DataCollection<int, ReaderApproval> $reader_approvals
 * @property string $digest
 * @property string $author_type
 * @property string $author_id
 * @property string $approver_type
 * @property string $approver_id
 * @property Carbon $approved_at
 */
final class RuleRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use NamedByRuleScope;

    public const string CREATED_AT = 'approved_at';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope' => RuleScopeCast::class,
            'revision' => 'integer',
            'payload' => CommandRule::class,
            'script_bindings' => DataCollection::class.':'.ScriptBinding::class,
            'reader_approvals' => DataCollection::class.':'.ReaderApproval::class,
            'approved_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => $revision->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * Writes the approved revision of a proposal's revision as the rule's next revision in its scope.
     *
     * @param  list<ReaderApproval>  $readers  one for a rule with a verification contract, none otherwise
     * @param  list<ScriptBinding>  $scripts
     *
     * @throws RuleRevisionInvalid when the readers do not match the rule's purpose
     */
    public static function create(
        RuleProposalRevision $proposed,
        string $projectKey,
        ActorIdentity $approver,
        array $readers,
        array $scripts,
    ): self {
        $rule = $proposed->payload;
        self::assertReadersFit($rule, $readers);

        $latest = self::query()->ofProject($projectKey)->ofRule($rule->scope, $rule->id)->max('revision');
        $approved = $rule->ownedBy($rule->scope, (int) $latest + 1);

        $ruleRevision = new self();
        $ruleRevision->project_key = $projectKey;
        $ruleRevision->scope = $approved->scope;
        $ruleRevision->rule_id = $approved->id;
        $ruleRevision->revision = $approved->revision;
        $ruleRevision->rule_proposal_revision_id = $proposed->id;
        $ruleRevision->payload = $approved;
        $ruleRevision->script_bindings = ScriptBinding::collect($scripts, DataCollection::class);
        $ruleRevision->reader_approvals = ReaderApproval::collect($readers, DataCollection::class);
        $ruleRevision->digest = $approved->digest();
        $ruleRevision->author_type = $proposed->author_type;
        $ruleRevision->author_id = $proposed->author_id;
        $ruleRevision->approver_type = $approver->type;
        $ruleRevision->approver_id = $approver->id;
        $ruleRevision->save();

        return $ruleRevision;
    }

    // ----------[ Predicates ]----------

    /**
     * Whether this revision belongs to the classification rule: the same project, owner and rule id.
     */
    public function belongsToRule(ClassificationRule $rule): bool
    {
        return $this->project_key === $rule->project_key
            && $this->scope->isSameOwner($rule->scope)
            && $this->rule_id === $rule->rule_id;
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses readers that do not fit the rule: one for a rule with a verification contract, none otherwise.
     *
     * @param  list<ReaderApproval>  $readers
     *
     * @throws RuleRevisionInvalid
     */
    private static function assertReadersFit(CommandRule $rule, array $readers): void
    {
        if ($rule->hasContract() && count($readers) !== 1) {
            throw RuleRevisionInvalid::readerMissing($rule->id);
        }

        if (! $rule->hasContract() && $readers !== []) {
            throw RuleRevisionInvalid::readerWithoutContract($rule->id);
        }
    }

    /**
     * Refuses every edit: a revision stays as it was written.
     *
     * @throws RevisionImmutable
     */
    private function assertUnedited(): never
    {
        throw RevisionImmutable::rule($this->id);
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
     * The rows of the given revision.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRevision(Builder $query, int $revision): void
    {
        $query->where('revision', $revision);
    }

    /**
     * The rows of the given rule proposal revision.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRuleProposalRevision(Builder $query, string $revisionId): void
    {
        $query->where('rule_proposal_revision_id', $revisionId);
    }
}
