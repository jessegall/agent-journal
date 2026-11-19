<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Domains\Support\DomainEntry;
use App\Processes\Commands\ApproveRuleBundle;
use App\Processes\Commands\ApproveRuleProposal;
use App\Processes\Commands\SaveCommandRule;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\ApprovalRefused;
use App\Processes\Exceptions\ClassificationUnavailable;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ActiveRules;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\OwnerApproval;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\RuleBundle;
use App\Processes\Values\RuleScope;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Each request classifies with Core's rules, the module bundles its project's owner activated and the project's own
 * active rules, read from the store each time (doc 21 revision 6, sections 9 and 51; stories 58, 59, 88, 89, 92, 93).
 */
final class ActiveRulesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_module_bundle_classifies_only_after_the_owner_activates_its_exact_digest(): void
    {
        $bundle = $this->installNotes(1);
        $this->assertFalse($this->isKnown('notes-cli list'));

        $this->asUser(new ApproveRuleBundle($bundle->module, $bundle->version, $bundle->digest()));
        $this->assertTrue($this->isKnown('notes-cli list'));

        $this->installNotes(2);
        $this->assertFalse($this->isKnown('notes-cli list'));
    }

    public function test_a_changed_bundle_cannot_be_activated_with_the_old_digest(): void
    {
        $old = $this->installNotes(1);
        $this->installNotes(2);

        $this->assertThrows(
            fn () => $this->asUser(new ApproveRuleBundle($old->module, $old->version, $old->digest())),
            ApprovalRefused::class,
        );
    }

    public function test_two_project_keys_in_one_worker_see_only_their_own_rules(): void
    {
        config(['processes.project_key' => 'project-a']);
        $this->asUser(new SaveCommandRule('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'));
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
        $this->asUser(new SaveCommandRule('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'));
        $proposal = RuleProposal::query()->sole();

        config(['processes.project_key' => 'project-b']);

        $this->assertThrows(
            fn () => $this->asUser(new ApproveRuleProposal($proposal->id, new OwnerApproval(1, 0, [], 'b'))),
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
        $tree = $this->app->make(ShellSyntax::class)->parse($line, ShellDialect::Bash);

        $classifier = $this->app->make(CommandClassifier::class);

        return $classifier->classify($tree, ExecutionContext::inFolder(base_path()))->isKnown();
    }

    private function asUser(object $command): mixed
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new OwnerAuthority('test'));

        return $this->app->make(CommandBus::class)->run($command);
    }
}
