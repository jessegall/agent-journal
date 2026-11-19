<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Commands\RetireAgent;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\CommandReplacementRefused;
use App\Bus\Exceptions\CommandResultChanged;
use App\Bus\Exceptions\ContinuationCalledTwice;
use App\Bus\Exceptions\MiddlewareSkippedCommand;
use App\Bus\Exceptions\MiddlewareSwallowedFailure;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\SendMessage;
use App\Communication\Models\Message;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Models\Rule;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Models\Task;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\CallsNextTwice;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ChangesResult;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\LimitPlanStarts;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAfterRetirement;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAll;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ReplacesCardsCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ReplacesTasksCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SendsToUnknownSession;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SkipsCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SwallowsFailure;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\TrimMessages;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\UppercasesText;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Support\TestIds;

/**
 * Module middleware on the Cards and Notes test modules (doc 19, Book E): the order by stage, owner and declaration,
 * a replacement the handler sees, a refusal that writes nothing, and every break of the middleware contract refused
 * by name.
 */
final class ModuleMiddlewareTest extends CommandBusTestCase
{
    protected function tearDown(): void
    {
        // The Rules commands commit for real here, so their rows go too.
        Rule::query()->delete();
        Plan::query()->delete();
        Task::query()->delete();
        Message::query()->withoutGlobalScopes()->delete();
        AgentSession::query()->delete();
        AssignmentRecord::query()->delete();
        Agent::query()->delete();

        parent::tearDown();
    }

    public function test_module_middleware_runs_by_stage_then_owner_then_declaration(): void
    {
        $trail = $this->installCommandModules();
        $this->startUserRequestAs(TestIds::of(1));

        $this->app->make(CommandBus::class)->run(new WriteNote('ordered'));

        $this->assertSame(['cards around all', 'notes around all', 'notes around write', 'notes inside'], $trail->steps);
    }

    public function test_a_replacement_reaches_the_handler_and_a_refusal_writes_nothing(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(UppercasesText::class, CommandScope::command(WriteNote::class)));
        $this->startUserRequestAs(TestIds::of(1));

        $this->assertSame('LOUD', $this->rowText($this->app->make(CommandBus::class)->run(new WriteNote('loud'))));

        $this->installCommandModules(MiddlewareDeclaration::around(RefusesAll::class, CommandScope::all()));
        $this->startUserRequestAs(TestIds::of(1));
        $this->expectException(CommandRefused::class);
        $this->app->make(CommandBus::class)->run(new WriteNote('refused'));
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
    public function test_a_middleware_that_breaks_its_contract_is_refused_by_name(string $middleware, string $refusal): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around($middleware, CommandScope::all()));
        $this->startUserRequestAs(TestIds::of(1));

        $this->expectException($refusal);
        $this->expectExceptionMessage($middleware);

        $this->app->make(CommandBus::class)->run(new WriteNote('broken'));
    }

    public function test_a_middleware_that_swallows_a_failure_is_refused_and_keeps_the_failure(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::inside(SwallowsFailure::class, CommandScope::all()));
        $this->startUserRequestAs(TestIds::of(1));

        try {
            $this->app->make(CommandBus::class)->run(new RefuseNote('swallowed'));
            $this->fail('The swallowed failure was let through.');
        } catch (MiddlewareSwallowedFailure $failure) {
            $this->assertInstanceOf(CommandRefused::class, $failure->getPrevious());
        }
    }

    public function test_notes_audits_the_rules_commands_and_not_its_own_writes(): void
    {
        $trail = $this->installCommandModules();
        $this->startUserRequestAs(TestIds::of(1));
        $bus = $this->app->make(CommandBus::class);

        $bus->run(new ApproveRule(Rule::proposed('Every phase ends with its tests.', 'Phases ended untested.', null, ActorContext::forAgent(TestIds::of(10)))->id));
        $bus->run(new WriteNote('not a rules command'));

        $this->assertSame(1, $this->app->make(ConnectionInterface::class)->table('module_command_rows')->where('text', 'audit ApproveRule')->count());
        $this->assertSame(1, count(array_keys($trail->steps, 'notes audits rules', true)));
    }

    public function test_the_audit_row_rolls_back_with_a_refused_rules_command(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(TestIds::of(1));
        $settled = Rule::holding('Already active.');

        try {
            $this->app->make(CommandBus::class)->run(new ApproveRule($settled->id));
            $this->fail('A settled rule was approved.');
        } catch (RuleNotProposed) {
            $this->assertSame(0, $this->app->make(ConnectionInterface::class)->table('module_command_rows')->where('text', 'audit ApproveRule')->count());
        }
    }

    private function launchedSession(): AgentSession
    {
        return $this->app->make(LaunchSessions::class)->launch(Agent::named('Reader', AgentRole::MainAgent), TestSelections::of('claude-code'), TestSelections::requestId())->session;
    }

    public function test_notes_limits_plan_starts_and_nothing_is_written(): void
    {
        $trail = $this->installCommandModulesRequiring(['Plans'], MiddlewareDeclaration::around(LimitPlanStarts::class, CommandScope::command(StartPlan::class)));
        $this->startUserRequestAs(TestIds::of(1));
        $plan = Plan::factory()->create(['title' => 'Quota', 'type' => PlanType::Build]);

        try {
            $this->app->make(CommandBus::class)->run(new StartPlan($plan->id));
            $this->fail('The quota let the start through.');
        } catch (CommandRefused) {
            $this->assertSame(PlanState::Planned, $plan->fresh()?->state);
        }

        $this->app->make(CommandBus::class)->run(new WriteNote('not a plan start'));
        $this->assertSame(1, count(array_keys($trail->steps, 'notes limits plan starts', true)));
    }

    public function test_the_send_handler_gets_the_trimmed_body(): void
    {
        $this->installCommandModulesRequiring(['Chat'], MiddlewareDeclaration::around(TrimMessages::class, CommandScope::command(SendMessage::class)));
        $session = $this->launchedSession();
        $this->startUserRequestAs(TestIds::of(1));

        $this->app->make(CommandBus::class)->run(new SendMessage("  Trim me  \n", new ActorIdentity(ActorType::Agent, $session->agent_id)));

        $this->assertSame('Trim me', Message::query()->ownedBy(new ActorIdentity(ActorType::Agent, $session->agent_id))->sole()->body);
    }

    public function test_a_message_pointed_at_an_unknown_agent_is_refused_and_leaves_no_message(): void
    {
        $this->installCommandModulesRequiring(['Chat'], MiddlewareDeclaration::around(SendsToUnknownSession::class, CommandScope::command(SendMessage::class)));
        $session = $this->launchedSession();
        $this->startUserRequestAs(TestIds::of(1));

        try {
            $this->app->make(CommandBus::class)->run(new SendMessage('Hello', new ActorIdentity(ActorType::Agent, $session->agent_id)));
            $this->fail('A message reached an agent that does not exist.');
        } catch (ActorUnavailable) {
            $this->assertSame(0, Message::query()->ownedBy(new ActorIdentity(ActorType::Agent, $session->agent_id))->count());
        }
    }

    public function test_a_middleware_may_not_replace_tasks_private_finish(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(ReplacesTasksCommand::class, CommandScope::all()));
        $this->startUserRequestAs(TestIds::of(1));

        $this->expectException(CommandReplacementRefused::class);

        $this->app->make(CommandBus::class)->run(new FinishTask(Task::factory()->create(['title' => 'Kept'])->id, 0, 'Done.'));
    }

    public function test_a_refusal_after_retirement_leaves_the_agent_unretired_with_its_assignments(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::inside(RefusesAfterRetirement::class, CommandScope::command(RetireAgent::class)));
        $helper = Agent::named('Helper', AgentRole::ReadOnlyHelper);
        $task = Task::factory()->create(['title' => 'Held']);
        $this->startUserRequestAs(TestIds::of(1));
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $bus->run(new AssignRecord($task->assignmentIdentity(), AssigneeIdentity::of($helper)));

        try {
            $bus->run(new RetireAgent($helper->id));
            $this->fail('The refused retirement went through.');
        } catch (CommandRefused) {
            $this->assertFalse($helper->fresh()?->isRetired());
            $this->assertSame(1, AssignmentRecord::query()->count());
        }
    }

    public function test_a_middleware_may_not_replace_another_owners_private_command(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(ReplacesCardsCommand::class, CommandScope::all()));
        $this->startUserRequestAs(TestIds::of(1));

        $this->expectException(CommandReplacementRefused::class);

        $this->app->make(CommandBus::class)->run(new ShuffleDeck('red'));
    }
}
