<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Casts\RuleScopeCast;
use App\CommandRules\Exceptions\RuleRevisionInvalid;
use App\CommandRules\Values\ReaderApproval;
use App\CommandRules\Values\RuleScope;
use App\CommandRules\Values\ScriptBinding;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Exceptions\RevisionImmutable;
use App\Models\Projects\Project;
use App\Models\Support\ProjectMembership;
use App\Models\Support\JournalModel;
use App\Models\Support\NamedByRuleScope;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Values\CommandRule;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $project_id
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
 * @property CarbonImmutable $approved_at
 * @property RuleScope $scope
 *
 * @mixin \Eloquent
 */
final class RuleRevision extends JournalModel implements ProjectOwned, ReadableModel
{
    use ProjectMembership;
    use BoundedReads;
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
        Project $project,
        ActorReference $approver,
        array $readers,
        array $scripts,
    ): self {
        $rule = $proposed->payload;
        self::assertReadersFit($rule, $readers);

        $approved = $rule->ownedBy($rule->scope, self::resolveNextRevision($project, $rule));

        $ruleRevision = new self();
        $ruleRevision->project_id = $project->id;
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
        return $this->project_id === $rule->project_id
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

    // ----------[ Queries ]----------

    /**
     * The revision the rule's next approval in the project takes: one past its newest.
     */
    public static function resolveNextRevision(Project $project, CommandRule $rule): int
    {
        return (int) self::query()->inProject($project->id)->ofRule($rule->scope, $rule->id)->max('revision') + 1;
    }

    // ----------[ Scopes ]----------

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
