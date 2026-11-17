<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Domain\Access\AccessDomain;
use App\Domain\Chat\ChatDomain;
use App\Domain\Contracts\Domain;
use App\Domain\Memory\MemoryDomain;
use App\Domain\Plans\PlansDomain;
use App\Domain\Processes\ProcessesDomain;
use App\Domain\Profiles\ProfilesDomain;
use App\Domain\Reminders\RemindersDomain;
use App\Domain\Rules\RulesDomain;
use App\Domain\Sequences\SequencesDomain;
use App\Domain\Tasks\TasksDomain;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class DomainClassesTest extends TestCase
{
    /**
     * Hooks, Agents and Links are the core in app/Core, which every domain uses without declaring it. Each domain's
     * export list is pinned by short class name, so publishing a type is a visible decision.
     *
     * @return iterable<string, array{class-string<Domain>, list<class-string<Domain>>, list<string>}>
     */
    public static function domains(): iterable
    {
        yield 'Tasks' => [TasksDomain::class, [], ['TaskStarted', 'TaskFinished', 'TaskBlocked', 'TaskCancelled', 'TaskProgressCounter', 'TaskProgress', 'TaskReader', 'TaskMissing', 'TaskAssignmentReader', 'TaskAssignmentCompletion', 'AssignedTaskReader', 'TaskCard', 'TaskFilters', 'TaskList', 'TaskState', 'TaskWorkState']];
        yield 'Plans' => [PlansDomain::class, [TasksDomain::class], ['PlanStarted', 'PlanProgressChanged', 'PlanReader', 'PlanAssignments', 'PlanStarter', 'PlanMissing', 'StartDenied', 'PlanFilters', 'PlanList', 'PlanSelection', 'PlanCard', 'AssignedPlanFilters', 'AssignedPlanList', 'PlanProgress', 'PlanKind', 'PlanState']];
        yield 'Profiles' => [ProfilesDomain::class, [], []];
        yield 'Chat' => [ChatDomain::class, [], ['MessageSent', 'MessageAnswered', 'MessageDismissed', 'ConversationReader', 'MessageSender', 'Conversation', 'MessageView', 'MessageState', 'MessageBodyEmpty']];
        yield 'Memory' => [MemoryDomain::class, [], []];
        yield 'Rules' => [RulesDomain::class, [], ['RuleApproved', 'RuleDenied', 'RuleRemoved', 'RuleReader', 'RuleReviewer', 'RuleFilters', 'RuleList', 'RuleView', 'RuleState', 'RuleMissing', 'RuleNotProposed']];
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
