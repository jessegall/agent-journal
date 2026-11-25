<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Commands\Agents\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\Asks\AdvanceAsk\AdvanceAskCommand;
use App\Commands\Asks\RouteAsk\RouteAskCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Time\ServerClock;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Asks\UnansweredReason;
use App\Models\Agents\Agent;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Support\ActorIdentity;
use App\Support\AskClock;
use App\Support\AskTypeRegistry;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\ProfileProposal;
use App\Support\RequestKey;
use App\Support\SupervisorDefinitions;
use App\Support\SystemActor;
use App\Values\AskTypeKey;
use App\Values\SupervisorTarget;
use App\Values\TrustedEntryAuthority;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\FixedServerClock;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The supervision clock moves an overdue ask up to the owner, where the root closes it unanswered; a holder that
 * keeps answering never lets its queue escalate.
 */
#[TimeLimit(seconds: 6, reason: 'It activates the profiles and routes several asks through the bus.')]
final class AdvanceAskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'ask_hops', 'asks', 'ask_requesters', 'supervisor_changes', 'supervisor_links',
        'assignments', 'command_receipts', 'session_tokens', 'agent_sessions', 'agents', 'profile_revisions', 'profiles',
        'agent_stacks', 'users',
    ];

    private Agent $requester;

    private Agent $holder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
        $this->requester = $this->journal->idleAgent('Requester', 'journal-worker')->agentCalled('Requester');
        $this->holder = $this->journal->idleAgent('Reviewer', 'journal-code-reviewer')->agentCalled('Reviewer');
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
        $this->assertSame($this->journal->ownerUser()->id, AskHop::findCurrentFor($ask)->actor_id);

        $this->advanceAt($ask, $start->addMinutes(32));

        $this->assertSame(UnansweredReason::RootTimeout, $ask->refresh()->outcome);
    }

    private function routedAsk(string $body): Ask
    {
        $type = $this->app->make(AskTypeRegistry::class)->get(AskTypeKey::of('question'));
        $reference = Ask::resolveNewReference();
        $ask = Ask::create(
            $reference,
            ActorIdentity::of($this->requester),
            $type->key(),
            "submission {$body}",
            $body,
            $type->resolver()->resolve($type->subject(), $reference, null),
            SupervisorTarget::forActor(ActorIdentity::of($this->holder)),
        );
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(CommandBus::class)->run(new RouteAskCommand($reference, 0));

        return $ask->refresh();
    }

    private function answer(Ask $ask): void
    {
        AskHop::findCurrentFor($ask->refresh())->answer('Done.', 'delivered');
        $ask->close();
    }

    /**
     * Advances the ask as the engine does, as if it were the moment given.
     */
    private function advanceAt(Ask $ask, CarbonImmutable $now): void
    {
        $this->app->instance(ServerClock::class, new FixedServerClock($now));
        $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), new TrustedEntryAuthority('engine pass'));
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
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $type = AskTypeKey::of('question');
        $actor = ActorIdentity::of($agent);
        $version = $this->app->make(SupervisorDefinitions::class)->routeFor($actor, $type)->version;
        $this->app->make(CommandBus::class)->run(new ChangeSupervisorCommand($actor, $target, $version, $type));
    }
}
