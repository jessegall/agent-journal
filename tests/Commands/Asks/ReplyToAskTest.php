<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Commands\Agents\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\Asks\AdvanceAsk\AdvanceAskCommand;
use App\Commands\Asks\ReplyToAsk\ReplyToAskCommand;
use App\Commands\Asks\RouteAsk\RouteAskCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Time\ServerClock;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Asks\UnansweredReason;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Asks\Ask;
use App\Support\ActorIdentity;
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
use Tests\Support\StartsAgentRequests;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Two days close an ask, and the owner's late reply keeps the outcome it closed with.
 */
#[TimeLimit(seconds: 6, reason: 'It activates the profiles and routes several asks through the bus.')]
final class ReplyToAskTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const string LATE_ANSWER = 'Late, but here it is.';

    private const array TABLES = [
        'ask_hops', 'asks', 'ask_requesters', 'supervisor_changes', 'supervisor_links',
        'assignments', 'command_receipts', 'session_tokens', 'agent_sessions', 'agents', 'profile_revisions', 'profiles',
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
        $this->requester = Agent::create('Requester', 'journal-worker', $this->localProject());
        $this->holder = Agent::create('Reviewer', 'journal-code-reviewer', $this->localProject());
        $this->superviseWith($this->requester, SupervisorTarget::forActor(ActorIdentity::of($this->holder)));
    }

    public function test_two_days_close_an_ask_and_the_owners_late_text_keeps_its_outcome(): void
    {
        $ask = $this->routedAsk('question');

        $this->advanceAt($ask, CarbonImmutable::now()->addHours(Ask::LIFETIME_HOURS));
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new ReplyToAskCommand($ask->reference, self::LATE_ANSWER));

        $closed = $ask->refresh();
        $this->assertSame(UnansweredReason::TotalExpiry, $closed->outcome);
        $this->assertSame(self::LATE_ANSWER, $closed->late_answer);
        $this->assertFalse($closed->open);
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
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new RouteAskCommand($reference, 0));

        return $ask->refresh();
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

    private function superviseWith(Agent $agent, SupervisorTarget $target): void
    {
        $this->startUserRequestAs($this->owner->id);
        $type = AskTypeKey::of('question');
        $actor = ActorIdentity::of($agent);
        $version = $this->app->make(SupervisorDefinitions::class)->routeFor($actor, $type)->version;
        $this->app->make(CommandBus::class)->run(new ChangeSupervisorCommand($actor, $target, $version, $type));
    }
}
