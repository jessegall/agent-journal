<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\ApproveRuleBundle\ApproveRuleBundleCommand;
use App\Contracts\Bus\CommandClassifier;
use App\Enums\Processes\ShellDialect;
use App\Exceptions\ApprovalRefused;
use App\Support\CommandRuleRegistry;
use App\Support\DomainEntry;
use App\Support\Syntax\TreeParser;
use App\Values\CommandRule;
use App\Values\ExecutionContext;
use App\Values\RuleBundle;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A module's rule bundle classifies commands only once the owner activates its exact digest; a changed bundle cannot
 * be activated with the old digest.
 */
final class ApproveRuleBundleTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    public function test_a_module_bundle_classifies_only_after_the_owner_activates_its_exact_digest(): void
    {
        $bundle = $this->installNotes(1);
        $this->assertFalse($this->isKnown('notes-cli list'));

        $this->asUser(new ApproveRuleBundleCommand($bundle->module, $bundle->version, $bundle->digest()));
        $this->assertTrue($this->isKnown('notes-cli list'));

        $this->installNotes(2);
        $this->assertFalse($this->isKnown('notes-cli list'));
    }

    public function test_a_changed_bundle_cannot_be_activated_with_the_old_digest(): void
    {
        $old = $this->installNotes(1);
        $this->installNotes(2);

        $this->assertThrows(
            fn () => $this->asUser(new ApproveRuleBundleCommand($old->module, $old->version, $old->digest())),
            ApprovalRefused::class,
        );
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

    private function isKnown(string $line): bool
    {
        $this->app->forgetScopedInstances();
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);

        $classifier = $this->app->make(CommandClassifier::class);

        return $classifier->classify($tree, ExecutionContext::inFolder(base_path()))->isKnown();
    }
}
