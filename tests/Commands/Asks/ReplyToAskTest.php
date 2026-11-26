<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Accounts\Enums\CommandEntry;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\SystemActor;
use App\Agents\Commands\ChangeSupervisor\ChangeSupervisorCommand;
use App\Asks\AskTypeRegistry;
use App\Asks\Commands\AdvanceAsk\AdvanceAskCommand;
use App\Asks\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Asks\Commands\RouteAsk\RouteAskCommand;
use App\Asks\Enums\UnansweredReason;
use App\Asks\SupervisorDefinitions;
use App\Bus\CommandEntrance;
use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Engine\EngineAccess;
use App\Models\Agents\Agent;
use App\Models\Asks\Ask;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Profiles\ProfileProposal;
use App\Support\ActorReference;
use App\Time\Contracts\ServerClock;
use App\Values\AskTypeKey;
use App\Values\SupervisorTarget;
use App\Values\TrustedEntryAuthority;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\FixedServerClock;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Two days close an ask, and the owner's late reply keeps the outcome it closed with.
 */
#[TimeLimit(seconds: 6, reason: 'It activates the profiles and routes several asks through the bus.')]
#[TestsCommand(ReplyToAskCommand::class)]
final class ReplyToAskTest extends TestCase
{
    use CommitsHookRows;

    private const string LATE_ANSWER = 'Late, but here it is.';

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
        $this->superviseWith($this->requester, SupervisorTarget::forActor(ActorReference::of($this->holder)));
    }

    public function test_two_days_close_an_ask_and_the_owners_late_text_keeps_its_outcome(): void
    {
        $ask = $this->routedAsk('question');

        $this->advanceAt($ask, CarbonImmutable::now()->addHours(Ask::LIFETIME_HOURS));
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
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
            ActorReference::of($this->requester),
            $type->key(),
            "submission {$body}",
            $body,
            $type->resolver()->resolve($type->subject(), $reference, null),
            SupervisorTarget::forActor(ActorReference::of($this->holder)),
        );
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
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
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $type = AskTypeKey::of('question');
        $actor = ActorReference::of($agent);
        $version = $this->app->make(SupervisorDefinitions::class)->routeFor($actor, $type)->version;
        $this->app->make(CommandBus::class)->run(new ChangeSupervisorCommand($actor, $target, $version, $type));
    }
}
