<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Support\Domain;
use Domain\Chat\ChatDomain;
use Domain\Comments\CommentsDomain;
use Domain\Documents\DocumentsDomain;
use Domain\Helpers\HelpersDomain;
use Domain\Memory\MemoryDomain;
use Domain\Plans\PlansDomain;
use Domain\Questions\QuestionsDomain;
use Domain\Reminders\RemindersDomain;
use Domain\Rules\RulesDomain;
use Domain\Sequences\SequencesDomain;
use Domain\Tasks\TasksDomain;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Support\DomainBoot;

final class DomainClassesTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class, CommentsDomain::class, DocumentsDomain::class, HelpersDomain::class, MemoryDomain::class, PlansDomain::class, QuestionsDomain::class, RemindersDomain::class, RulesDomain::class, SequencesDomain::class, TasksDomain::class);
    }

    public function test_documents_are_registered_and_require_chat_and_comments(): void
    {
        $domains = require dirname(__DIR__, 3).'/bootstrap/domains.php';

        $this->assertContains(DocumentsDomain::class, $domains);
        $this->assertSame([ChatDomain::class, CommentsDomain::class], new DocumentsDomain()->requires());
    }

    /**
     * Hooks, Agents and Links are the core in app, which every domain uses without declaring it. Each domain's
     * export list is pinned by short class name, so publishing a type is a visible decision.
     *
     * @return iterable<string, array{class-string<Domain>, list<class-string<Domain>>, list<string>}>
     */
    public static function domains(): iterable
    {
        yield 'Tasks' => [TasksDomain::class, [CommentsDomain::class], [
            'TaskStarted',
            'TaskDescribed',
            'TaskFinished',
            'TaskBlocked',
            'TaskCancelled',
            'TaskProgressCounter',
            'TaskProgress',
            'TaskResolver',
            'TaskSummary',
            'TaskStateEvent',
            'TaskRunEndEvent',
            'TaskMissing',
            'TaskAssignmentResolver',
            'TaskAssignmentCompletion',
            'AssignedTaskResolver',
            'TaskCard',
            'TaskFilters',
            'TaskGraph',
            'TaskGraphDestinations',
            'TaskGraphEdge',
            'TaskGraphNode',
            'TaskGraphResolver',
            'TaskGraphSuggestion',
            'TaskList',
            'TaskState',
            'TaskListResolver',
            'TaskDetailsResolver',
            'TaskExecution',
            'TaskDetails',
            'TaskText',
            'TaskType',
            'TaskHolderFilter',
            'TaskStartCommitted',
            'TaskHistoryResolver',
            'TaskHistoryPage',
            'TaskTransition',
            'TaskLogged',
            'TaskLogResolver',
            'TaskLogPage',
            'TaskLogLine',
            'TaskCheckRecorded',
            'TaskProofResolver',
            'TaskProofPage',
            'TaskProof',
            'TaskWaitChanged',
            'TaskWaitResolver',
            'TaskWaits',
            'TaskWaitLink',
            'TaskWaitChange',
            'ApplyTaskWaitsCommand',
            'TaskWaitPair',
            'TaskGraphChanged',
            'TaskWaitRefused',
        ]];

        yield 'Plans' => [PlansDomain::class, [TasksDomain::class], [
            'PlanStarted',
            'PlanProgressChanged',
            'PlanReviewRequested',
            'PlanReviewWithdrawn',
            'PlanReviewDecided',
            'PlanReviewState',
            'PlanResolver',
            'StartPlanCommand',
            'AssignPlanWorkCommand',
            'ReassignPlanWorkCommand',
            'UnassignPlanWorkCommand',
            'PlanMissing',
            'StartDenied',
            'PlanFilters',
            'PlanList',
            'PlanSelection',
            'PlanCard',
            'AssignedPlanFilters',
            'AssignedPlanList',
            'PlanProgress',
            'PlanType',
            'PlanState',
            'PlanFinished',
            'PlanCancelled',
            'PlanDetailsResolver',
            'PlanDetails',
            'PlanPhaseTasks',
            'PhaseDetails',
            'PhaseMissing',
        ]];

        yield 'Chat' => [ChatDomain::class, [SequencesDomain::class, QuestionsDomain::class], ['ChatMessageChanged', 'DockChanged', 'PairChats']];

        yield 'Memory' => [MemoryDomain::class, [], [
            'MemoryResolver',
            'MemoryPage',
            'MemoryCard',
            'MemoryRevisionChanged',
        ]];

        yield 'Rules' => [RulesDomain::class, [], [
            'RuleApproved',
            'RuleDenied',
            'RuleRemoved',
            'RuleResolver',
            'ApproveRuleCommand',
            'DenyRuleCommand',
            'RuleFilters',
            'RuleList',
            'RuleView',
            'RuleState',
            'RuleMissing',
            'RuleNotProposed',
            'RuleDetailsResolver',
            'RuleDetails',
        ]];

        yield 'Sequences' => [SequencesDomain::class, [], []];

        yield 'Questions' => [QuestionsDomain::class, [], [
            'AnswerQuestionCommand',
            'QuestionAsked',
            'QuestionAnswered',
            'QuestionNotificationKeys',
            'QuestionSummaryReader',
            'QuestionSummary',
        ]];

        yield 'Comments' => [CommentsDomain::class, [], [
            'PostCommentCommand',
            'PostTextCommentCommand',
            'CommentPosted',
            'CommentResolver',
            'PublicCommentResolver',
            'CommentDetails',
            'CommentList',
            'RecordCommentLocation',
            'RecordCommentView',
            'TextCommentLocation',
            'TextCommentView',
            'WholeRecord',
            'PublicComment',
        ]];

        yield 'Reminders' => [RemindersDomain::class, [], []];

        yield 'Helpers' => [HelpersDomain::class, [DocumentsDomain::class], [
            'CancelHelperJobCommand',
            'ContinueHelperCommand',
            'HelperBusy',
            'HelperJobAlreadyEnded',
            'HelperJobUnfinished',
            'HelperStartUncertain',
            'HelperProfileMismatch',
            'HelperProfileTypeConflict',
            'HelperProfilesUnavailable',
            'HelperReceipt',
            'HelperRequestConflict',
            'HelperRetired',
            'HelperUnavailable',
            'HelperWork',
            'JobState',
            'StartDetails',
            'SendHelperCommand',
            'StartHelperCommand',
            'SteerHelperCommand',
            'SteerReceipt',
        ]];
    }

    /**
     * @param  class-string<Domain>  $class
     * @param  list<class-string<Domain>>  $requires
     * @param  list<string>  $exports
     */
    #[DataProvider('domains')]
    public function test_each_domain_describes_itself_requires_only_what_was_approved_and_exports_its_listed_types(
        string $class,
        array $requires,
        array $exports,
    ): void {
        $domain = new $class();

        $this->assertNotSame('', $domain->description());
        $this->assertSame($requires, $domain->requires());
        $this->assertEqualsCanonicalizing($exports, array_map(class_basename(...), $domain->exports()->all()));
    }
}
