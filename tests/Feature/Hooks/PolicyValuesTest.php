<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Enums\Agents\AccessType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Profiles\AccessRuleType;
use App\Exceptions\ExecutionBudgetInvalid;
use App\Exceptions\ExecutionPolicyInvalid;
use App\Exceptions\StopConditionsInvalid;
use App\Exceptions\UnknownAccessType;
use App\Values\AccessPolicy;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\Operation;
use App\Values\OperationGrant;
use App\Values\ProcessGrants;
use App\Values\ProfileBase;
use App\Values\ResourceRequest;
use App\Values\StopCondition;
use App\Values\StopConditions;
use Tests\TestCase;

/**
 * Core's role and policy values: the writing helper's own bottom, each role's default grants, stop conditions and
 * execution budgets, and the named refusals of everything a policy may not hold.
 */
final class PolicyValuesTest extends TestCase
{
    public function test_each_role_gets_its_section_51_grants(): void
    {
        $main = ProfileBase::mainAgent()->defaultAccess()->paths[0];
        $resolver = ProfileBase::readOnlyHelper()->defaultAccess()->paths[0];
        $writer = ProfileBase::writingHelper()->defaultAccess()->paths[0];

        $this->assertTrue($main->permits(AccessType::Delete));
        $this->assertFalse($main->permits(AccessType::Publish));
        $this->assertTrue($resolver->permits(AccessType::Read));
        $this->assertTrue($resolver->permits(AccessType::Execute));
        $this->assertFalse($resolver->permits(AccessType::Edit));
        $this->assertFalse($resolver->permits(AccessType::Test));
        $this->assertTrue($writer->permits(AccessType::Edit));
        $this->assertTrue($writer->permits(AccessType::Build));
        $this->assertFalse($writer->permits(AccessType::Publish));
        $this->assertSame([], ProfileBase::writingHelper()->defaultAccess()->destinations);
    }

    public function test_a_decision_names_its_rule(): void
    {
        $push = new Operation(
            'shell',
            'shell:git.push',
            [AccessType::Execute, AccessType::Publish, AccessType::Network],
            [ResourceRequest::path('/workspace')],
            ['push'],
            1,
        );
        $edit = new Operation('tool', 'tool:edit', [AccessType::Edit], [ResourceRequest::path('/workspace/a.php')], [], 1);
        $secret = new Operation(
            'tool',
            'tool:read',
            [AccessType::Read],
            [ResourceRequest::path('/home/journal/.claude/.credentials.json')],
            [],
            1,
        );
        $writer = ProfileBase::writingHelper()->defaultAccess();
        $denying = new AccessPolicy(
            $writer->paths,
            [],
            ProcessGrants::everything(),
            [new OperationGrant('shell:git.push', [])],
            ['shell:git.push'],
        );

        $this->assertSame(
            [false, AccessRuleType::NotGranted],
            [$writer->decide($push)->isAllowed, $writer->decide($push)->rule],
        );
        $this->assertSame(
            [true, AccessRuleType::ScopeGrant],
            [$writer->decide($edit)->isAllowed, $writer->decide($edit)->rule],
        );
        $this->assertSame(
            [false, AccessRuleType::ProtectedPath],
            [$writer->decide($secret)->isAllowed, $writer->decide($secret)->rule],
        );
        $this->assertSame(
            [false, AccessRuleType::ExplicitDenial],
            [$denying->decide($push)->isAllowed, $denying->decide($push)->rule],
        );
        $readOnly = ProfileBase::readOnlyHelper()->defaultAccess();
        $this->assertSame(
            [false, AccessRuleType::NotGranted],
            [$readOnly->decide($edit)->isAllowed, $readOnly->decide($edit)->rule],
        );
    }

    public function test_an_escaping_operand_and_an_unknown_access_type_are_refused(): void
    {
        $escaping = new Operation('tool', 'tool:read', [AccessType::Read], [ResourceRequest::path('../outside')], [], 1);

        $this->assertSame(
            AccessRuleType::Unclassified,
            ProfileBase::mainAgent()->defaultAccess()->decide($escaping)->rule,
        );
        $this->assertRefused(UnknownAccessType::class, fn () => AccessType::fromKey('unknown'));
    }

    public function test_a_writer_type_starts_with_a_clean_worktree_and_stop_budgets_are_checked(): void
    {
        $this->assertSame(
            [StopCondition::CLEAN_WORKTREE],
            array_map(
                fn (StopCondition $condition) => $condition->key,
                ProfileBase::writingHelper()->defaultStopConditions(),
            ),
        );
        $this->assertSame([], ProfileBase::readOnlyHelper()->defaultStopConditions());
        $this->assertSame(30, new StopConditions([])->attemptSeconds);

        $this->assertRefused(
            StopConditionsInvalid::class,
            fn () => new StopConditions([$this->condition('slow', 61)], 120),
        );
        $this->assertRefused(
            StopConditionsInvalid::class,
            fn () => new StopConditions([$this->condition('a', 20), $this->condition('b', 20)]),
        );
        $this->assertRefused(StopConditionsInvalid::class, fn () => new StopConditions([], 121));
        $this->assertRefused(
            StopConditionsInvalid::class,
            fn () => new StopConditions(
                array_map(fn (int $number) => $this->condition("c{$number}", 1), range(1, 17)),
                120,
            ),
        );
        $this->assertRefused(
            StopConditionsInvalid::class,
            fn () => new StopConditions(
                [new StopCondition('path', 'Path', 'journal-check', [], [], 'workspace', 5, 1024, 'Fix it.')],
            ),
        );
        $this->assertRefused(
            StopConditionsInvalid::class,
            fn () => new StopConditions([$this->condition('twice', 5), $this->condition('twice', 5)]),
        );
    }

    public function test_execution_budgets_and_modes_follow_section_62_and_the_roles(): void
    {
        $budgets = ExecutionBudgets::defaults();

        $this->assertSame(
            [2, 4 * 1024 ** 3, 4 * 1024 ** 3, 256, 1024, 256 * 1024 ** 2, 10 * 1024 ** 3, 21600],
            [
                $budgets->cpuCores,
                $budgets->memoryBytes,
                $budgets->memorySwapBytes,
                $budgets->processes,
                $budgets->openFiles,
                $budgets->tmpBytes,
                $budgets->workspaceBytes,
                $budgets->wallSeconds,
            ],
        );
        $this->assertSame(ExecutionModeType::ProtectedHost, ProfileBase::mainAgent()->defaultExecutionMode());
        $this->assertSame(ExecutionModeType::RequiredContainer, ProfileBase::readOnlyHelper()->defaultExecutionMode());
        $this->assertSame(
            ExecutionModeType::RequiredContainer,
            new ExecutionPolicy(
                ExecutionModeType::RequiredContainer,
                'registry/helper@sha256:abc',
                'worktree-1',
                $budgets,
                [],
            )->mode,
        );

        $this->assertTrue(ProfileBase::writingHelper()->isContainerRequired());
        $this->assertRefused(
            ExecutionPolicyInvalid::class,
            fn () => new ExecutionPolicy(ExecutionModeType::RequiredContainer, null, 'worktree-1', $budgets, []),
        );
        $this->assertRefused(
            ExecutionBudgetInvalid::class,
            fn () => new ExecutionBudgets(9, 1024, 1024, 1, 1, 1, 1, 1, 1),
        );
        $this->assertRefused(
            ExecutionBudgetInvalid::class,
            fn () => new ExecutionBudgets(2, 1024, 2048, 1, 1, 1, 1, 1, 1),
        );
        $this->assertRefused(
            ExecutionBudgetInvalid::class,
            fn () => new ExecutionBudgets(0, 1024, 1024, 1, 1, 1, 1, 1, 1),
        );
    }

    private function condition(string $key, int $seconds): StopCondition
    {
        return new StopCondition(
            $key,
            $key,
            '/opt/journal/bin/journal-check',
            [$key],
            [AccessType::Read],
            'workspace',
            $seconds,
            1024,
            'Fix it.',
        );
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
