<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\AskSupervisor\AskSupervisorCommand;
use App\Commands\AssignRecord\AssignRecordCommand;
use App\Commands\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\ReassignRecord\ReassignRecordCommand;
use App\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Commands\RetireAgent\RetireAgentCommand;
use App\Commands\RouteAsk\RouteAskCommand;
use App\Commands\WithdrawAsk\WithdrawAskCommand;
use App\Contracts\Actors\ActorAttention;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Chat\AskReader;
use App\Contracts\Work\WorkProgress;
use App\Enums\AskRouteStatus;
use App\Enums\NoSubject;
use App\Exceptions\AskRefused;
use App\Exceptions\AssignmentTypeInternal;
use App\Exceptions\RecordUnavailable;
use App\Exceptions\SupervisorRouteInvalid;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStackRow;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\AskAttention;
use App\Support\AskRecords;
use App\Support\AskTypeRegistry;
use App\Support\AttentionOrigin;
use App\Support\AttentionOutcome;
use App\Support\ProfileProposal;
use App\Support\References\StateReference;
use App\Support\RequestKey;
use App\Support\States\ReadyState;
use App\Support\States\Support\AnsweringAskStateReference;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Support\Ticks\TickingTypes;
use App\Values\AskReference;
use App\Values\AskTypeKey;
use App\Values\StackTarget;
use App\Values\SupervisorTarget;
use App\Values\WorkReference;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Models\Task;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

final class AskRecordsTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;
    use StartsAgentRequests;

    private const string FIXTURE_ADVICE = 'Read the fixture.';

    private const string INPUT_ADVICE = 'Check the input file.';

    private const array TABLES = [
        'ask_hops', 'asks', 'ask_requesters', 'supervisor_changes', 'supervisor_links',
        'assignments', 'command_receipts', 'start_tokens', 'agent_sessions', 'agents', 'profile_revisions', 'profiles',
        'agent_stacks', 'tasks',
    ];

    public function test_the_internal_route_holds_an_ask_and_public_assignment_cannot_change_it(): void
    {
        $this->activateProfiles();
        $requester = Agent::create('Requester', 'journal-worker');
        $holder = Agent::create('Supervisor', 'journal-code-reviewer');
        $ask = $this->retainFor($requester, SupervisorTarget::forActor(ActorIdentity::of($holder)));
        $record = $ask->assignmentIdentity();
        $bus = $this->app->make(CommandBus::class);
        $keys = $this->app->make(RequestKey::class);
        $keys->set('public-assign-ask');

        $this->assertThrows(
            fn () => $bus->run(new AssignRecordCommand($record, $holder->assigneeIdentity())),
            AssignmentTypeInternal::class,
        );
        $keys->forget();
        $this->assertSame(AskRouteStatus::Assigned, $bus->run(new RouteAskCommand(new AskReference($ask->id), 0)));
        $assignment = AssignmentRecord::query()->forRecord($record)->firstOrFail()->toAssignment;
        $this->assertTrue($assignment->holder()->isSameAs($holder->assigneeIdentity()));
        $this->assertSame(1, AskHop::query()->count());
        $keys->set('public-reassign-ask');
        $this->assertThrows(
            fn () => $bus->run(new ReassignRecordCommand($record, $assignment->reference, $requester->assigneeIdentity())),
            AssignmentTypeInternal::class,
        );
    }

    public function test_an_unrelated_actor_sees_nothing_while_a_former_holder_can_still_read_the_ask(): void
    {
        $this->activateProfiles();
        $requester = Agent::create('Requester', 'journal-worker');
        $holder = Agent::create('Supervisor', 'journal-code-reviewer');
        $outsider = Agent::create('Other', 'journal-code-reviewer');
        $ask = $this->retainFor($requester, SupervisorTarget::forActor(ActorIdentity::of($holder)));
        $reference = new AskReference($ask->id);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new RouteAskCommand($reference, 0));
        $bus->run(new RetireAgentCommand($holder->id));
        $this->assertFalse(AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->exists());

        $this->startRequestAs($outsider->id, TestIds::of(91));
        $this->assertThrows(fn () => $this->app->make(AskRecords::class)->read($reference), RecordUnavailable::class);
        $this->startRequestAs($holder->id, TestIds::of(92));
        $this->assertSame($ask->id, $this->app->make(AskRecords::class)->read($reference)->id);
    }

    public function test_a_symbolic_profile_keeps_the_ask_pending_and_the_submission_key_replays(): void
    {
        $this->activateProfiles();
        $requester = Agent::create('Requester', 'journal-worker');
        $target = SupervisorTarget::parse('profile:journal-code-reviewer');
        $ask = $this->retainFor($requester, $target);
        $again = $this->retainFor($requester, $target, routeVersion: 1);

        $this->assertSame($ask->id, $again->id);
        $this->assertSame($ask->work, $again->work);
        $this->assertSame(
            AskRouteStatus::PendingProfile,
            $this->app->make(CommandBus::class)->run(new RouteAskCommand(new AskReference($ask->id), 0)),
        );
        $this->assertFalse(AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->exists());
    }

    public function test_registry_refuses_an_unknown_or_duplicate_ask_type(): void
    {
        $registry = $this->app->make(AskTypeRegistry::class);
        $question = $registry->get(AskTypeKey::from('question'));

        $this->assertSame(15, $question->allowance()->i);
        $this->assertThrows(fn () => $registry->register($question), AskRefused::class);
        $this->assertThrows(fn () => $registry->get(AskTypeKey::from('imaginary')), SupervisorRouteInvalid::class);
    }

    public function test_the_plain_signed_cli_retains_a_question_for_the_reviewers_supervisor(): void
    {
        $this->activateProfiles();
        $start = TestStart::start('journal-code-reviewer');
        $recipient = TestStart::start('journal-main');
        $this->runCommandsAs($start);

        $this->artisan('ask:make', ['text' => 'Why does this fail?'])->assertSuccessful();
        $this->artisan('ask:list')->assertSuccessful();

        $ask = Ask::query()->ownedBy(ActorIdentity::of($start->agent))->firstOrFail();
        $this->artisan('ask:show', ['ask' => $ask->id])->assertSuccessful();
        $this->assertSame('question', $ask->type_key);
        $this->assertStringStartsWith('free:', $ask->work);
        $this->assertTrue(
            AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->firstOrFail()
                ->toAssignment->holder()->isSameAs($recipient->agent->assigneeIdentity()),
        );

        $this->signed($recipient, '/agent/asks/reply', [
            'id' => $ask->id,
            'body' => 'Read the fixture.',
            'request_key' => 'reply-to-fixture-ask',
        ])->assertOk()->assertJsonPath('reply', self::FIXTURE_ADVICE);
        $this->assertFalse($ask->refresh()->open);

        $this->artisan('ask:make', ['text' => 'Please check another file.'])->assertSuccessful();
        $ask = Ask::query()->ownedBy(ActorIdentity::of($start->agent))->where('open', true)->sole();
        $this->artisan('ask:withdraw', ['ask' => $ask->id])->assertSuccessful();
        $this->assertFalse($ask->refresh()->open);
    }

    public function test_replay_and_closing_asks_are_available_at_the_open_limit(): void
    {
        $this->activateProfiles();
        $requester = Agent::create('Requester', 'journal-worker');
        $recipient = Agent::create('Supervisor', 'journal-code-reviewer');
        $this->startRequestAs($requester->id, TestIds::of(91));
        $commands = $this->app->make(CommandBus::class);

        $first = $commands->run(new AskSupervisorCommand('First question', 'first'));
        $second = $commands->run(new AskSupervisorCommand('Second question', 'second'));

        foreach (['third', 'fourth', 'fifth'] as $ordinal) {
            $commands->run(new AskSupervisorCommand('Another question', $ordinal));
        }

        $this->assertThrows(fn () => $commands->run(new AskSupervisorCommand('One more', 'sixth')), AskRefused::class);
        $this->assertEquals($first, $commands->run(new AskSupervisorCommand('First question', 'first')));
        $this->assertThrows(fn () => $commands->run(new AskSupervisorCommand('Changed', 'first')), AskRefused::class);

        $this->startRequestAs($recipient->id, TestIds::of(92));
        $inbox = $this->app->make(AskReader::class);
        $this->assertTrue($inbox->card($first)->obligation);
        $commands->run(new ReplyToAskCommand($first, 'Check the input file.'));

        $this->startRequestAs($requester->id, TestIds::of(91));
        $commands->run(new WithdrawAskCommand($second));
        $this->assertSame(self::INPUT_ADVICE, $inbox->card($first)->reply);
        $this->assertFalse($inbox->card($second)->open);
        $this->assertSame(3, Ask::openSubmissions(ActorIdentity::of($requester)));
        $this->assertSame(3, AssignmentRecord::query()->count());
        $this->assertSame(
            AskHop::PENDING_DELIVERY,
            AskHop::query()->where('ask_id', $first->id)->firstOrFail()->attention,
        );
    }

    public function test_a_typed_review_still_requires_a_visible_work_record(): void
    {
        $this->activateProfiles();
        $requester = Agent::create('Requester', 'journal-code-reviewer');
        $this->startRequestAs($requester->id, TestIds::of(91));
        $commands = $this->app->make(CommandBus::class);

        $this->assertThrows(
            fn () => $commands->run(new AskSupervisorCommand('Review this', 'review', AskTypeKey::from('review.ready'))),
            AskRefused::class,
        );
        $this->assertSame(0, Ask::openSubmissions(ActorIdentity::of($requester)));
    }

    public function test_asks_resolve_the_current_work_from_a_registered_domain_state(): void
    {
        $this->activateProfiles();
        $start = TestStart::start('journal-code-reviewer');
        $start->startRequest($this->app);
        $task = Task::create('Review a task', 'Check the expected result.', $start->agent);
        $start->openStack($this->app);
        $commands = $this->app->make(CommandBus::class);
        $commands->run(new StartTaskCommand($task->id));

        $question = $commands->run(new AskSupervisorCommand('What should I check?', 'question'));
        $review = $commands->run(new AskSupervisorCommand('Review this task', 'review', AskTypeKey::from('review.ready')));

        $expected = WorkReference::forRecord($task->assignmentIdentity());
        $this->assertEquals($expected, Ask::query()->findOrFail($question->id)->workReference);
        $this->assertEquals($expected, Ask::query()->findOrFail($review->id)->workReference);
        $this->assertSame('review.ready', Ask::query()->findOrFail($review->id)->type_key);
    }

    public function test_the_owner_sees_the_ask_card_on_the_inbox_page(): void
    {
        $this->activateProfiles();
        $requester = Agent::create('Requester', 'journal-main');
        $owner = User::factory()->create();
        $this->startUserRequestAs($owner->id);
        $this->retainFor($requester, SupervisorTarget::parse('owner'));

        $this->actingAs($owner)->get('/web/asks')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page->component('web/Asks')
                ->where('page.data.cards.0.body', 'Where does this fail?')
                ->where('page.data.cards.0.open', true),
        );
    }

    public function test_only_the_first_ask_enters_the_stack_its_close_offers_the_next_and_reply_attention_recovers_once(): void
    {
        $this->activateProfiles();
        $requester = TestStart::start('journal-worker');
        $recipient = TestStart::start('journal-code-reviewer');
        $holder = ActorIdentity::of($recipient->agent);
        $author = ActorIdentity::of($requester->agent);
        $attention = $this->mock(ActorAttention::class);
        $attention->shouldReceive('request')->withArgs(
            fn (ActorIdentity $actor, AttentionOrigin $origin) => $actor->isSameAs($holder),
        )->twice()->andReturn(AttentionOutcome::accepted('holder-wake', 1));
        $attention->shouldReceive('request')->withArgs(
            fn (ActorIdentity $actor, AttentionOrigin $origin) => $actor->isSameAs($author),
        )->twice()->andReturn(AttentionOutcome::noRuntime(), AttentionOutcome::accepted('reply-wake', 1));
        $now = CarbonImmutable::now();
        new AgentStackRow()->startFor(
            new StackTarget($recipient->agent->id, $recipient->session->id),
            new FrameRecords([
                new FrameRecord('ready', new StateReference(ReadyState::TYPE_KEY, NoSubject::None), true, 1, $now),
            ]),
            new TickingTypes([]),
        );
        $requester->startRequest($this->app);
        $this->app->instance(ActorAttention::class, $attention);
        $commands = $this->app->make(CommandBus::class);
        $first = $commands->run(new AskSupervisorCommand('First question', 'first'));
        $second = $commands->run(new AskSupervisorCommand('Next question', 'second'));
        $firstHop = AskHop::query()->where('ask_id', $first->id)->sole();
        $secondHop = AskHop::query()->where('ask_id', $second->id)->sole();
        $progress = $this->app->make(WorkProgress::class);
        $firstWork = AnsweringAskStateReference::forHop($firstHop)->workReference();
        $secondWork = AnsweringAskStateReference::forHop($secondHop)->workReference();
        $this->assertNotNull($progress->enteredAt($holder, $firstWork));
        $this->assertNull($progress->enteredAt($holder, $secondWork));

        $recipient->startRequest($this->app);
        $this->app->instance(ActorAttention::class, $attention);
        $this->app->make(CommandBus::class)->run(new ReplyToAskCommand($first, 'Check the input.'));
        $this->assertNotNull($progress->enteredAt($holder, $secondWork));
        $this->assertSame(AskHop::PENDING_DELIVERY, $firstHop->refresh()->attention);

        $delivery = $this->app->make(AskAttention::class);
        $delivery->recover();
        $delivery->recover();
        $this->assertSame('reply-wake', $firstHop->refresh()->attention);
    }

    public function test_a_user_supervisor_has_a_card_without_a_runtime_wake(): void
    {
        $this->activateProfiles();
        $owner = User::factory()->create();
        $this->startUserRequestAs($owner->id);
        $this->mock(ActorAttention::class)->shouldNotReceive('request');
        $requester = Agent::create('Requester', 'journal-main');
        $this->startRequestAs($requester->id, TestIds::of(99));

        $ask = $this->app->make(CommandBus::class)->run(new AskSupervisorCommand('Check my result.', 'owner-question'));
        $this->startUserRequestAs($owner->id);
        $card = $this->app->make(AskReader::class)->card($ask);

        $this->assertTrue($card->obligation);
        $this->assertSame($owner->id, $card->holderId);
    }

    private function activateProfiles(): void
    {
        $this->startTestUserRequest(1);
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
    }

    private function retainFor(Agent $requester, SupervisorTarget $target, int $routeVersion = 0): Ask
    {
        $actor = ActorIdentity::of($requester);
        $type = $this->app->make(AskTypeRegistry::class)->get(AskTypeKey::from('question'));
        $this->app->make(CommandBus::class)->run(new ChangeSupervisorCommand($actor, $target, $routeVersion, $type->key()));
        $reference = Ask::newReference();

        return Ask::submit(
            $reference,
            $actor,
            $type->key(),
            'submission',
            'Where does this fail?',
            $type->resolver()->resolve($type->subject(), $reference, null),
            $target,
        );
    }
}
