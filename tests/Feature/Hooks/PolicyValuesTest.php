<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Agents\Enums\AccessRuleType;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Exceptions\AccessPolicyInvalid;
use App\Agents\Exceptions\ExecutionBudgetInvalid;
use App\Agents\Exceptions\ExecutionPolicyInvalid;
use App\Agents\Exceptions\StopConditionsInvalid;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ClassGrant;
use App\Agents\Values\Operation;
use App\Agents\Values\OperationGrant;
use App\Agents\Values\ResourceRequest;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\HelperReadyState;
use App\Hooks\States\WritingHelperReadyState;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Operations\Exceptions\UnknownAccessType;
use Illuminate\Events\Dispatcher;
use Tests\TestCase;

/**
 * Core's role and policy values: the writing helper's own bottom, each role's default grants, stop conditions and
 * execution budgets, and the named refusals of everything a policy may not hold.
 */
final class PolicyValuesTest extends TestCase
{
    public function test_a_writing_helper_stack_restores_its_own_bottom(): void
    {
        $key = AgentRole::WritingHelper->value;
        $registry = (new StateTypes(new Dispatcher()))->registry();

        $state = $registry->get($key)->statesFor(new StateReferences([new StateReference($key, NoSubject::None)]))->stateAt(0);

        $this->assertSame('hooks.writing_helper_ready', $key);
        $this->assertSame(ReadyStateType::WritingHelper, ReadyStateType::forKey($key));
        $this->assertInstanceOf(WritingHelperReadyState::class, $state);
        $this->assertInstanceOf(HelperReadyState::class, ReadyStateType::ReadOnlyHelper->newState());
    }

    public function test_each_role_gets_its_section_51_grants(): void
    {
        $main = AccessPolicy::defaultsFor(AgentRole::MainAgent);
        $reader = AccessPolicy::defaultsFor(AgentRole::ReadOnlyHelper);
        $writer = AccessPolicy::defaultsFor(AgentRole::WritingHelper);

        $this->assertTrue($main->grants(AccessType::Delete, ResourceAreaType::Workspace));
        $this->assertTrue($main->grants(AccessType::Delegate, ResourceAreaType::JournalWork));
        $this->assertFalse($main->grants(AccessType::Publish, ResourceAreaType::Workspace));
        $this->assertFalse($main->grants(AccessType::Admin, ResourceAreaType::JournalControl));

        $this->assertTrue($reader->grants(AccessType::Read, ResourceAreaType::Workspace));
        $this->assertTrue($reader->grants(AccessType::Create, ResourceAreaType::JournalContent));
        $this->assertFalse($reader->grants(AccessType::Edit, ResourceAreaType::Workspace));
        $this->assertFalse($reader->grants(AccessType::Test, ResourceAreaType::Workspace));
        $this->assertFalse($reader->grants(AccessType::Delete, ResourceAreaType::JournalContent));
        $this->assertFalse($reader->grants(AccessType::Delegate, ResourceAreaType::JournalWork));

        $this->assertTrue($writer->grants(AccessType::Edit, ResourceAreaType::Workspace));
        $this->assertTrue($writer->grants(AccessType::Build, ResourceAreaType::Scratch));
        $this->assertFalse($writer->grants(AccessType::Publish, ResourceAreaType::Workspace));
        $this->assertFalse($writer->grants(AccessType::Network, ResourceAreaType::ProviderConnection));
        $this->assertFalse($writer->grants(AccessType::Delegate, ResourceAreaType::JournalWork));
    }

    public function test_a_decision_names_its_rule(): void
    {
        $push = new Operation('shell', 'shell:git.push', [AccessType::Execute, AccessType::Publish, AccessType::Network], [new ResourceRequest(ResourceAreaType::Workspace, '/workspace')], ['push'], 1);
        $edit = new Operation('tool', 'tool:edit', [AccessType::Edit], [new ResourceRequest(ResourceAreaType::Workspace, '/workspace/a.php')], [], 1);
        $secret = new Operation('tool', 'tool:read', [AccessType::Read], [new ResourceRequest(ResourceAreaType::Protected, '/home/.claude')], [], 1);
        $writer = AccessPolicy::defaultsFor(AgentRole::WritingHelper);
        $denying = AccessPolicy::make(AgentRole::WritingHelper, $writer->classGrants, [new OperationGrant('shell:git.push', [])], ['shell:git.push'], [], []);

        $this->assertSame([false, AccessRuleType::NotGranted], [$writer->decide($push)->allowed, $writer->decide($push)->rule]);
        $this->assertSame([true, AccessRuleType::ClassGrant], [$writer->decide($edit)->allowed, $writer->decide($edit)->rule]);
        $this->assertSame([false, AccessRuleType::ProtectedArea], [$writer->decide($secret)->allowed, $writer->decide($secret)->rule]);
        $this->assertSame([false, AccessRuleType::ExplicitDenial], [$denying->decide($push)->allowed, $denying->decide($push)->rule]);
        $this->assertSame([false, AccessRuleType::NotGranted], [AccessPolicy::defaultsFor(AgentRole::ReadOnlyHelper)->decide($edit)->allowed, AccessPolicy::defaultsFor(AgentRole::ReadOnlyHelper)->decide($edit)->rule]);
    }

    public function test_a_protected_grant_and_a_reader_above_its_ceiling_are_refused(): void
    {
        $this->assertRefused(AccessPolicyInvalid::class, fn () => AccessPolicy::make(AgentRole::MainAgent, [new ClassGrant(ResourceAreaType::Protected, [AccessType::Read])], [], [], [], []));
        $this->assertRefused(AccessPolicyInvalid::class, fn () => AccessPolicy::make(AgentRole::ReadOnlyHelper, [new ClassGrant(ResourceAreaType::Workspace, [AccessType::Edit])], [], [], [], []));
        $this->assertRefused(UnknownAccessType::class, fn () => AccessType::fromKey('unknown'));
    }

    public function test_a_writer_always_has_clean_worktree_and_stop_budgets_are_checked(): void
    {
        $this->assertSame([StopCondition::CLEAN_WORKTREE], array_map(fn (StopCondition $condition) => $condition->key, StopConditions::defaultsFor(AgentRole::WritingHelper)->conditions));
        $this->assertSame([], StopConditions::defaultsFor(AgentRole::ReadOnlyHelper)->conditions);
        $this->assertSame(30, StopConditions::defaultsFor(AgentRole::MainAgent)->attemptSeconds);

        $this->assertRefused(StopConditionsInvalid::class, fn () => StopConditions::make(AgentRole::WritingHelper, []));
        $this->assertRefused(StopConditionsInvalid::class, fn () => StopConditions::make(AgentRole::ReadOnlyHelper, [$this->condition('slow', 61)], 120));
        $this->assertRefused(StopConditionsInvalid::class, fn () => StopConditions::make(AgentRole::ReadOnlyHelper, [$this->condition('a', 20), $this->condition('b', 20)]));
        $this->assertRefused(StopConditionsInvalid::class, fn () => StopConditions::make(AgentRole::ReadOnlyHelper, [], 121));
        $this->assertRefused(StopConditionsInvalid::class, fn () => StopConditions::make(AgentRole::ReadOnlyHelper, array_map(fn (int $number) => $this->condition("c{$number}", 1), range(1, 17)), 120));
        $this->assertRefused(StopConditionsInvalid::class, fn () => StopConditions::make(AgentRole::ReadOnlyHelper, [new StopCondition('path', 'Path', 'journal-check', [], [], 'workspace', 5, 1024, 'Fix it.')]));
        $this->assertRefused(StopConditionsInvalid::class, fn () => StopConditions::make(AgentRole::ReadOnlyHelper, [$this->condition('twice', 5), $this->condition('twice', 5)]));
    }

    public function test_execution_budgets_and_modes_follow_section_62_and_the_roles(): void
    {
        $budgets = ExecutionBudgets::defaults();

        $this->assertSame([2, 4 * 1024 ** 3, 4 * 1024 ** 3, 256, 1024, 256 * 1024 ** 2, 10 * 1024 ** 3, 21600], [$budgets->cpuCores, $budgets->memoryBytes, $budgets->memorySwapBytes, $budgets->processes, $budgets->openFiles, $budgets->tmpBytes, $budgets->workspaceBytes, $budgets->wallSeconds]);
        $this->assertSame(ExecutionModeType::ProtectedHost, AgentRole::MainAgent->defaultExecutionMode());
        $this->assertSame(ExecutionModeType::RequiredContainer, AgentRole::ReadOnlyHelper->defaultExecutionMode());
        $this->assertSame(ExecutionModeType::RequiredContainer, ExecutionPolicy::make(AgentRole::WritingHelper, ExecutionModeType::RequiredContainer, 'registry/helper@sha256:abc', 'worktree-1', $budgets, [])->mode);

        $this->assertRefused(ExecutionPolicyInvalid::class, fn () => ExecutionPolicy::make(AgentRole::WritingHelper, ExecutionModeType::ProtectedHost, null, 'worktree-1', $budgets, []));
        $this->assertRefused(ExecutionPolicyInvalid::class, fn () => ExecutionPolicy::make(AgentRole::ReadOnlyHelper, ExecutionModeType::RequiredContainer, null, 'worktree-1', $budgets, []));
        $this->assertRefused(ExecutionBudgetInvalid::class, fn () => ExecutionBudgets::make(9, 1024, 1024, 1, 1, 1, 1, 1));
        $this->assertRefused(ExecutionBudgetInvalid::class, fn () => ExecutionBudgets::make(2, 1024, 2048, 1, 1, 1, 1, 1));
        $this->assertRefused(ExecutionBudgetInvalid::class, fn () => ExecutionBudgets::make(0, 1024, 1024, 1, 1, 1, 1, 1));
    }

    private function condition(string $key, int $seconds): StopCondition
    {
        return new StopCondition($key, $key, '/opt/journal/bin/journal-check', [$key], [AccessType::Read], 'workspace', $seconds, 1024, 'Fix it.');
    }

    /**
     * @param  class-string<\Throwable>  $class
     */
    private function assertRefused(string $class, \Closure $make): void
    {
        try {
            $make();
            $this->fail("{$class} was not thrown.");
        } catch (\InvalidArgumentException $refusal) {
            $this->assertInstanceOf($class, $refusal);
        }
    }
}
