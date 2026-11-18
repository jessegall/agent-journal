<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Domains\Support\Domain;
use Domain\Access\AccessDomain;
use Domain\Chat\ChatDomain;
use Domain\Memory\MemoryDomain;
use Domain\Plans\PlansDomain;
use Domain\Processes\ProcessesDomain;
use Domain\Profiles\ProfilesDomain;
use Domain\Reminders\RemindersDomain;
use Domain\Rules\RulesDomain;
use Domain\Sequences\SequencesDomain;
use Domain\Tasks\TasksDomain;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class DomainClassesTest extends TestCase
{
    /**
     * Hooks, Agents and Links are the core in app, which every domain uses without declaring it. Each domain's
     * export list is pinned by short class name, so publishing a type is a visible decision.
     *
     * @return iterable<string, array{class-string<Domain>, list<class-string<Domain>>, list<string>}>
     */
    public static function domains(): iterable
    {
        yield 'Tasks' => [TasksDomain::class, [], ['TaskStarted', 'TaskFinished', 'TaskBlocked', 'TaskCancelled', 'TaskProgressCounter', 'TaskProgress', 'TaskReader', 'TaskSummary', 'TaskMissing', 'TaskAssignmentReader', 'TaskAssignmentCompletion', 'AssignedTaskReader', 'TaskCard', 'TaskFilters', 'TaskList', 'TaskState', 'TaskWorkState']];
        yield 'Plans' => [PlansDomain::class, [TasksDomain::class], ['PlanStarted', 'PlanProgressChanged', 'PlanReader', 'StartPlan', 'AssignPlanWork', 'ReassignPlanWork', 'UnassignPlanWork', 'PlanMissing', 'StartDenied', 'PlanFilters', 'PlanList', 'PlanSelection', 'PlanCard', 'AssignedPlanFilters', 'AssignedPlanList', 'PlanProgress', 'PlanType', 'PlanState']];
        yield 'Profiles' => [ProfilesDomain::class, [], []];
        yield 'Chat' => [ChatDomain::class, [], ['MessageSent', 'MessageAnswered', 'MessageDismissed', 'ConversationReader', 'SendMessage', 'Conversation', 'MessageView', 'MessageState', 'MessageBodyEmpty']];
        yield 'Memory' => [MemoryDomain::class, [], []];
        yield 'Rules' => [RulesDomain::class, [], ['RuleApproved', 'RuleDenied', 'RuleRemoved', 'RuleReader', 'ApproveRule', 'DenyRule', 'RuleFilters', 'RuleList', 'RuleView', 'RuleState', 'RuleMissing', 'RuleNotProposed']];
        yield 'Sequences' => [SequencesDomain::class, [], []];
        yield 'Reminders' => [RemindersDomain::class, [], []];
        yield 'Processes' => [ProcessesDomain::class, [], []];
        yield 'Access' => [AccessDomain::class, [], []];
    }

    /**
     * @param  class-string<Domain>  $class
     * @param  list<class-string<Domain>>  $requires
     * @param  list<string>  $exports
     */
    #[DataProvider('domains')]
    public function test_each_domain_describes_itself_requires_only_what_was_approved_and_exports_its_listed_types(string $class, array $requires, array $exports): void
    {
        $domain = new $class;

        $this->assertNotSame('', $domain->description());
        $this->assertSame($requires, $domain->requires());
        $this->assertSame($exports, array_map(class_basename(...), $domain->exports()));
    }
}
