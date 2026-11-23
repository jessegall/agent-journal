<?php

declare(strict_types=1);

namespace Tests\Feature\Supervision;

use App\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\AdvanceAsk\AdvanceAskCommand;
use App\Commands\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Commands\RouteAsk\RouteAskCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Time\ServerClock;
use App\Enums\CommandEntry;
use App\Enums\UnansweredReason;
use App\Models\Agents\Agent;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Support\ActorIdentity;
use App\Support\AskClock;
use App\Support\AskTypeRegistry;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\EngineActor;
use App\Support\ProfileProposal;
use App\Support\RequestKey;
use App\Support\SupervisorRouting;
use App\Values\AskTypeKey;
use App\Values\SupervisorTarget;
use App\Values\TrustedEntryAuthority;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Tests\Support\CommitsHookRows;
use Tests\Support\FixedServerClock;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * An ask's clock and its escalation (task 954): a holder that keeps answering never lets its queue escalate, the ask
 * it answers runs out on its own allowance while those behind it wait, an overdue ask moves up to the owner, the root
 * of the chain closes it unanswered, 48 hours close it whatever it does, and the owner's late text keeps that outcome.
 */
#[TimeLimit(seconds: 6, reason: 'It activates the profiles and routes several asks through the bus.')]
final class AskClockTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const string LATE_ANSWER = 'Late, but here it is.';

    private const array TABLES = [
        'ask_hops', 'asks', 'ask_requesters', 'supervisor_changes', 'supervisor_links',
        'assignments', 'command_receipts', 'start_tokens', 'agent_sessions', 'agents', 'profile_revisions', 'profiles',
        'agent_stacks', 'users',
    ];

    private Agent $requester;

    private Agent $holder;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
        $this->requester = Agent::create('Requester', 'journal-worker');
        $this->holder = Agent::create('Reviewer', 'journal-code-reviewer');
        $this->superviseWith($this->requester, SupervisorTarget::forActor(ActorIdentity::of($this->holder)));
    }

    public function test_a_holder_that_keeps_answering_never_lets_its_queue_escalate(): void
    {
        $start = CarbonImmutable::now();
        $asks = array_map(fn (int $number) => $this->routedAsk("question {$number}"), [1, 2, 3, 4]);

        $this->travelTo($start->addMinutes(10));
        $this->answer($asks[0]);
        $this->travelTo($start->addMinutes(20));
        $this->answer($asks[1]);

        $this->assertSame([], $this->dueAskIds($start->addMinutes(34)));
        $this->assertSame([$asks[2]->id], $this->dueAskIds($start->addMinutes(36)));
        $this->assertSame([$asks[2]->id, $asks[3]->id], $this->dueAskIds($start->addMinutes(51)));
    }

    public function test_an_overdue_ask_moves_up_to_the_owner_and_the_root_closes_it_unanswered(): void
    {
        $start = CarbonImmutable::now();
        $ask = $this->routedAsk('question');
        $this->superviseWith($this->holder, new SupervisorTarget());

        $this->advanceAt($ask, $start->addMinutes(16));

        $this->assertTrue($ask->refresh()->open);
        $this->assertSame($this->owner->id, AskHop::currentFor($ask)->actor_id);

        $this->advanceAt($ask, $start->addMinutes(32));

        $this->assertSame(UnansweredReason::RootTimeout, $ask->refresh()->outcome);
    }

    public function test_two_days_close_an_ask_and_the_owners_late_text_keeps_its_outcome(): void
    {
        $ask = $this->routedAsk('question');

        $this->advanceAt($ask, CarbonImmutable::now()->addHours(Ask::LIFETIME_HOURS));
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new ReplyToAskCommand($ask->reference(), self::LATE_ANSWER));

        $closed = $ask->refresh();
        $this->assertSame(UnansweredReason::TotalExpiry, $closed->outcome);
        $this->assertSame(self::LATE_ANSWER, $closed->late_answer);
        $this->assertFalse($closed->open);
    }

    private function routedAsk(string $body): Ask
    {
        $type = $this->app->make(AskTypeRegistry::class)->get(AskTypeKey::from('question'));
        $reference = Ask::newReference();
        $ask = Ask::submit(
            $reference,
            ActorIdentity::of($this->requester),
            $type->key(),
            "submission {$body}",
            $body,
            $type->resolver()->resolve($type->subject(), $reference, null),
            SupervisorTarget::forActor(ActorIdentity::of($this->holder)),
        );
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new RouteAskCommand($reference, 0));

        return $ask->refresh();
    }

    private function answer(Ask $ask): void
    {
        AskHop::currentFor($ask->refresh())->answer('Done.', 'delivered');
        $ask->close();
    }

    /**
     * Advances the ask as the engine does, as if it were the moment given.
     */
    private function advanceAt(Ask $ask, CarbonImmutable $now): void
    {
        $this->app->instance(ServerClock::class, new FixedServerClock($now));
        $this->app->make(CurrentActorSetter::class)->set(new EngineActor(), new TrustedEntryAuthority('engine pass'));
        $this->app->make(EngineAccess::class)->grantMaintenance(AdvanceAskCommand::MAINTENANCE_SCOPE);
        $this->app->make(RequestKey::class)->set('advance-'.$now->getTimestamp());
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(CommandEntrance::class)->through(
            CommandEntry::EngineMaintenance,
            fn () => $bus->run(new AdvanceAskCommand($ask->id)),
        );
    }

    /**
     * @return list<string>
     */
    private function dueAskIds(CarbonImmutable $now): array
    {
        $due = $this->app->make(AskClock::class)->dueHops($now, 5);

        return array_map(fn (AskHop $hop) => $hop->ask_id, $due);
    }

    private function superviseWith(Agent $agent, SupervisorTarget $target): void
    {
        $this->startUserRequestAs($this->owner->id);
        $type = AskTypeKey::from('question');
        $actor = ActorIdentity::of($agent);
        $version = $this->app->make(SupervisorRouting::class)->routeFor($actor, $type)->version;
        $this->app->make(CommandBus::class)->run(new ChangeSupervisorCommand($actor, $target, $version, $type));
    }
}
