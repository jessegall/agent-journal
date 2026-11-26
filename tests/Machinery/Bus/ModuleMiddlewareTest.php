<?php

declare(strict_types=1);

namespace Tests\Machinery\Bus;

use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandEnd as CommandEndContract;
use App\Enums\Engine\MiddlewareStage;
use App\Exceptions\CommandRefused;
use App\Exceptions\CommandReplacementRefused;
use App\Exceptions\CommandResultChanged;
use App\Exceptions\ContinuationCalledTwice;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\MiddlewareSkippedCommand;
use App\Exceptions\MiddlewareSwallowedFailure;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\CommandCall;
use App\Support\CommandEnd;
use App\Support\CommandFrame;
use App\Support\CommandRegistry;
use App\Support\CommandScope;
use App\Support\MiddlewareDeclaration;
use App\Support\RegisteredMiddleware;
use App\Support\RequestKey;
use Closure;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Rules\Commands\ApproveRule\ApproveRuleCommand;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Models\Rule;
use Domain\Rules\RulesDomain;
use Domain\Rules\Tests\Fixtures\RuleFixtures;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck\ShuffleDeckCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\CallsNextTwice;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ChangesResult;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\LimitPlanStarts;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAfterRetirement;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAll;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ReplacesCardsCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ReplacesTasksCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SendsToUnknownInbox;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SkipsCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SwallowsFailure;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\TrimMessages;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\UppercasesText;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote\RefuseNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\DomainBoot;
use Tests\Support\TestIds;
use Tests\Support\TestProjects;

/**
 * Module middleware on the Cards and Notes test modules: the order by stage, owner and declaration,
 * a replacement the handler sees, a refusal that writes nothing, and every break of the middleware contract refused
 * by name.
 */
final class ModuleMiddlewareTest extends CommandBusTestCase
{
    private const string TRIMMED_TEXT = 'Trim me';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, RulesDomain::class, TasksDomain::class);
    }

    protected function tearDown(): void
    {
        // The Rules commands commit for real here, so their rows go too.
        Rule::query()->delete();
        Plan::query()->delete();
        Task::query()->delete();
        Message::query()->withoutGlobalScopes()->delete();
        AgentSession::query()->delete();
        AssignmentRecord::query()->delete();
        InboxMember::query()->delete();
        Inbox::query()->delete();
        Agent::query()->delete();
        CommandReceipt::query()->delete();

        parent::tearDown();
    }

    public function test_module_middleware_runs_by_stage_then_owner_then_declaration(): void
    {
        $trail = $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('ordered'));

        $this->assertSame(
            ['cards around all', 'notes around all', 'notes around write', 'notes inside'],
            $trail->steps,
        );
    }

    public function test_a_command_reaches_its_end_having_passed_every_middleware_in_frame_order(): void
    {
        $this->installCommandModules();
        $ends = new class($this->app->make(CommandEnd::class)) implements CommandEndContract
        {
            /**
             * @var list<CommandCall>
             */
            public array $calls = [];

            public function __construct(private readonly CommandEnd $end) {}

            public function finish(CommandCall $call, Closure $handler): mixed
            {
                $this->calls[] = $call;

                return $this->end->finish($call, $handler);
            }
        };
        $this->app->instance(CommandEndContract::class, $ends);
        $this->app->forgetScopedInstances();
        $this->journal->actAsUserId(TestIds::of(1));

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('traced'));

        $this->assertSame([
            ...CommandFrame::FIRST,
            ...$this->moduleMiddleware(MiddlewareStage::BeforeTransaction),
            CommandFrame::TRANSACTION,
            ...CommandFrame::INSIDE,
            ...$this->moduleMiddleware(MiddlewareStage::InsideTransaction),
        ], $ends->calls[0]->trail());
    }

    public function test_a_replacement_reaches_the_handler_and_a_refusal_writes_nothing(): void
    {
        $this->installCommandModules(
            MiddlewareDeclaration::around(UppercasesText::class, CommandScope::command(WriteNoteCommand::class)),
        );
        $this->journal->actAsUserId(TestIds::of(1));

        $this->assertSame(
            'LOUD',
            $this->rowText($this->app->make(CommandBus::class)->run(new WriteNoteCommand('loud'))),
        );

        $this->installCommandModules(MiddlewareDeclaration::around(RefusesAll::class, CommandScope::all()));
        $this->journal->actAsUserId(TestIds::of(1));
        $this->expectException(CommandRefused::class);
        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('refused'));
    }

    /**
     * @return iterable<string, array{class-string, class-string<\Throwable>}>
     */
    public static function misbehavingMiddleware(): iterable
    {
        yield 'skips the command' => [SkipsCommand::class, MiddlewareSkippedCommand::class];

        yield 'calls next twice' => [CallsNextTwice::class, ContinuationCalledTwice::class];

        yield 'changes the result' => [ChangesResult::class, CommandResultChanged::class];
    }

    /**
     * @param  class-string  $middleware
     * @param  class-string<\Throwable>  $refusal
     */
    #[DataProvider('misbehavingMiddleware')]
    public function test_a_middleware_that_breaks_its_contract_is_refused_by_name(
        string $middleware,
        string $refusal,
    ): void {
        $this->installCommandModules(MiddlewareDeclaration::around($middleware, CommandScope::all()));
        $this->journal->actAsUserId(TestIds::of(1));

        $this->expectException($refusal);
        $this->expectExceptionMessage($middleware);

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('broken'));
    }

    public function test_a_middleware_that_swallows_a_failure_is_refused_and_keeps_the_failure(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::inside(SwallowsFailure::class, CommandScope::all()));
        $this->journal->actAsUserId(TestIds::of(1));

        try {
            $this->app->make(CommandBus::class)->run(new RefuseNoteCommand('swallowed'));
            $this->fail('The swallowed failure was let through.');
        } catch (MiddlewareSwallowedFailure $failure) {
            $this->assertInstanceOf(CommandRefused::class, $failure->getPrevious());
        }
    }

    public function test_notes_audits_the_rules_commands_and_not_its_own_writes(): void
    {
        $trail = $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
        $bus = $this->app->make(CommandBus::class);

        $bus->run(
            new ApproveRuleCommand(
                Rule::create(
                    'Every phase ends with its tests.',
                    'Phases ended untested.',
                    null,
                    ActorReference::forAgent(TestIds::of(10)),
                    TestProjects::localOwner(),
                )->id,
                TestProjects::localOwner()->key(),
            ),
        );
        $bus->run(new WriteNoteCommand('not a rules command'));

        $this->assertSame(
            1,
            $this->app->make(ConnectionInterface::class)->table('module_command_rows')->where(
                'text',
                'audit ApproveRule',
            )->count(),
        );
        $this->assertSame(1, count(array_keys($trail->steps, 'notes audits rules', true)));
    }

    public function test_the_audit_row_rolls_back_with_a_refused_rules_command(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
        $settled = $this->journal->user('Proposer')->user('Approver')->fixtures(RuleFixtures::class)->holdingRule(
            'Settled rule',
            'Already active.',
            'Proposer',
            'Approver',
        )->ruleCalled('Settled rule');

        try {
            $this->app->make(CommandBus::class)->run(
                new ApproveRuleCommand($settled->id, TestProjects::localOwner()->key()),
            );
            $this->fail('A settled rule was approved.');
        } catch (RuleNotProposed) {
            $this->assertSame(
                0,
                $this->app->make(ConnectionInterface::class)->table('module_command_rows')->where(
                    'text',
                    'audit ApproveRule',
                )->count(),
            );
        }
    }

    public function test_notes_limits_plan_starts_and_nothing_is_written(): void
    {
        $trail = $this->installCommandModulesRequiring(
            ['Plans'],
            MiddlewareDeclaration::around(LimitPlanStarts::class, CommandScope::command(StartPlanCommand::class)),
        );
        $this->journal->actAsUserId(TestIds::of(1));
        $plan = Plan::factory()->create(['title' => 'Quota', 'type' => PlanType::Build]);

        try {
            $this->app->make(CommandBus::class)->run(new StartPlanCommand($plan->id));
            $this->fail('The quota let the start through.');
        } catch (CommandRefused) {
            $this->assertSame(PlanStatus::Planned, $plan->fresh()?->status);
        }

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('not a plan start'));
        $this->assertSame(1, count(array_keys($trail->steps, 'notes limits plan starts', true)));
    }

    public function test_the_send_handler_gets_the_trimmed_body(): void
    {
        $this->installCommandModulesRequiring(
            ['Chat'],
            MiddlewareDeclaration::around(TrimMessages::class, CommandScope::command(SendMessageCommand::class)),
        );
        $user = $this->journal->owner()->ownerUser();
        $this->journal->actAsUserId($user->id);

        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        $messageId = $this->app->make(CommandBus::class)->run(new SendMessageCommand(
            $this->journal->inboxes()->personal(ActorReference::of($user))->id,
            "  Trim me  \n",
        ));

        $this->assertSame(self::TRIMMED_TEXT, Message::query()->withoutGlobalScopes()->findOrFail($messageId)->body);
    }

    public function test_a_message_pointed_at_an_unknown_inbox_is_refused_and_leaves_no_message(): void
    {
        $this->installCommandModulesRequiring(
            ['Chat'],
            MiddlewareDeclaration::around(SendsToUnknownInbox::class, CommandScope::command(SendMessageCommand::class)),
        );
        $user = $this->journal->owner()->ownerUser();
        $this->journal->actAsUserId($user->id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $command = new SendMessageCommand($this->journal->inboxes()->personal(ActorReference::of($user))->id, 'Hello');

        try {
            $this->app->make(CommandBus::class)->run($command);
            $this->fail('A message reached an inbox that does not exist.');
        } catch (InboxUnavailable) {
            $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
        }
    }

    public function test_a_middleware_may_not_replace_tasks_private_finish(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(ReplacesTasksCommand::class, CommandScope::all()));
        $this->journal->actAsUserId(TestIds::of(1));

        $this->expectException(CommandReplacementRefused::class);

        $this->app->make(CommandBus::class)->run(
            new FinishTaskCommand(Task::factory()->create(['title' => 'Kept'])->id, 0, 'Done.'),
        );
    }

    public function test_a_refusal_after_retirement_leaves_the_agent_unretired_with_its_assignments(): void
    {
        $this->installCommandModules(
            MiddlewareDeclaration::inside(
                RefusesAfterRetirement::class,
                CommandScope::command(RetireAgentCommand::class),
            ),
        );
        $helper = $this->journal->idleAgent('Helper', 'read-only-helper')->agentCalled('Helper');
        $task = Task::factory()->create(['title' => 'Held']);
        $this->journal->actAsUserId(TestIds::of(1));
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $bus->run(new AssignRecordCommand($task->assignmentIdentity(), AssigneeIdentity::of($helper)));

        try {
            $bus->run(new RetireAgentCommand($helper->id));
            $this->fail('The refused retirement went through.');
        } catch (CommandRefused) {
            $this->assertFalse($helper->fresh()?->isRetired());
            $this->assertSame(1, AssignmentRecord::query()->count());
        }
    }

    public function test_a_middleware_may_not_replace_another_owners_private_command(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(ReplacesCardsCommand::class, CommandScope::all()));
        $this->journal->actAsUserId(TestIds::of(1));

        $this->expectException(CommandReplacementRefused::class);

        $this->app->make(CommandBus::class)->run(new ShuffleDeckCommand('red'));
    }

    /**
     * The module middleware the registry runs on a written note in the stage, in its order.
     *
     * @return list<string>
     */
    private function moduleMiddleware(MiddlewareStage $stage): array
    {
        $entries = array_filter(
            $this->app->make(CommandRegistry::class)->middlewareFor(WriteNoteCommand::class),
            fn (RegisteredMiddleware $entry) => $entry->runsIn($stage),
        );

        return array_values(array_map(fn (RegisteredMiddleware $entry) => $entry->middlewareClass(), $entries));
    }
}
