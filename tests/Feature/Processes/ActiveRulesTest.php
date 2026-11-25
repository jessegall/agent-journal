<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Commands\CommandRules\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\CommandRules\SaveCommandRule\SaveCommandRuleCommand;
use App\Contracts\Bus\CommandClassifier;
use App\Enums\CommandRules\CommandClass;
use App\Enums\Processes\ShellDialect;
use App\Exceptions\ClassificationUnavailable;
use App\Models\CommandRules\RuleProposal;
use App\Support\ActiveRules;
use App\Support\CommandRuleRegistry;
use App\Support\DomainEntry;
use App\Support\Syntax\TreeParser;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ExecutionContext;
use App\Values\OwnerApproval;
use App\Values\ProgramSpellings;
use App\Values\RuleBundle;
use App\Values\RuleScope;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Each request classifies with Core's rules, the module bundles its project's owner activated and the project's own
 * active rules, read from the store each time.
 */
final class ActiveRulesTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    public function test_two_project_keys_in_one_worker_see_only_their_own_rules(): void
    {
        config(['processes.project_key' => 'project-a']);
        $this->asUser(new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'));
        $this->assertTrue($this->isKnown('tidy list'));
        $this->assertCount(1, $this->app->make(ActiveRules::class)->approvedFor('tidy list'));

        config(['processes.project_key' => 'project-b']);
        $this->assertFalse($this->isKnown('tidy list'));

        config(['processes.project_key' => 'project-a']);
        $this->assertTrue($this->isKnown('tidy list'));
    }

    public function test_another_projects_proposal_is_not_found_by_its_owner(): void
    {
        config(['processes.project_key' => 'project-a']);
        $this->asUser(new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'));
        $proposal = RuleProposal::query()->sole();

        config(['processes.project_key' => 'project-b']);

        $this->assertThrows(
            fn () => $this->asUser(new ApproveRuleProposalCommand($proposal->id, new OwnerApproval(1, 0, [], 'b'))),
            ModelNotFoundException::class,
        );
    }

    public function test_a_broken_rule_store_refuses_new_analysis(): void
    {
        Schema::drop('module_rule_bundles');

        $this->assertThrows(fn () => $this->isKnown('ls'), ClassificationUnavailable::class);
    }

    /**
     * Installs the notes test module's bundle, its rules at the given revision, as the start-up registry.
     */
    private function installNotes(int $revision): RuleBundle
    {
        $rules = array_map(
            fn (CommandRule $rule): CommandRule => $rule->ownedBy($rule->scope, $revision),
            DomainEntry::fromClass(NotesDomain::class)->commandRules(),
        );
        $registry = CommandRuleRegistry::from($rules);
        $this->app->instance(CommandRuleRegistry::class, $registry);

        return $registry->bundles()[0];
    }

    private function tidyRule(): CommandRule
    {
        return CommandRule::forProgram(
            'project.tidy.list',
            new ProgramSpellings('tidy'),
            ['list'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
        )->ownedBy(RuleScope::project(), 1);
    }

    private function isKnown(string $line): bool
    {
        $this->app->forgetScopedInstances();
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);

        $classifier = $this->app->make(CommandClassifier::class);

        return $classifier->classify($tree, ExecutionContext::inFolder(base_path()))->isKnown();
    }
}
