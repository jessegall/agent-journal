<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Commands\Agents\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Commands\Asks\RouteAsk\RouteAskCommand;
use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Commands\Assignments\ReassignRecord\ReassignRecordCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Asks\AskRouteStatus;
use App\Exceptions\AssignmentTypeInternal;
use App\Exceptions\RecordUnavailable;
use App\Models\Agents\Agent;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorReference;
use App\Support\AskRecords;
use App\Support\AskTypeRegistry;
use App\Support\ProfileProposal;
use App\Support\RequestKey;
use App\Values\AskReference;
use App\Values\AskTypeKey;
use App\Values\SupervisorTarget;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

#[TestsCommand(RouteAskCommand::class)]
final class RouteAskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'ask_hops', 'asks', 'ask_requesters', 'supervisor_changes', 'supervisor_links',
        'assignments', 'command_receipts', 'session_tokens', 'agent_sessions', 'agents', 'profile_revisions', 'profiles',
        'agent_stacks', 'tasks',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_the_internal_route_holds_an_ask_and_public_assignment_cannot_change_it(): void
    {
        $this->activateProfiles();
        $requester = $this->journal->idleAgent('Requester', 'journal-worker')->agentCalled('Requester');
        $holder = $this->journal->idleAgent('Supervisor', 'journal-code-reviewer')->agentCalled('Supervisor');
        $ask = $this->retainFor($requester, SupervisorTarget::forActor(ActorReference::of($holder)));
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
            fn () => $bus->run(
                new ReassignRecordCommand($record, $assignment->reference, $requester->assigneeIdentity()),
            ),
            AssignmentTypeInternal::class,
        );
    }

    public function test_an_unrelated_actor_sees_nothing_while_a_previous_holder_can_still_read_the_ask(): void
    {
        $this->activateProfiles();
        $requester = $this->journal->idleAgent('Requester', 'journal-worker')->agentCalled('Requester');
        $holder = $this->journal->idleAgent('Supervisor', 'journal-code-reviewer')->agentCalled('Supervisor');
        $outsider = $this->journal->idleAgent('Other', 'journal-code-reviewer')->agentCalled('Other');
        $ask = $this->retainFor($requester, SupervisorTarget::forActor(ActorReference::of($holder)));
        $reference = new AskReference($ask->id);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new RouteAskCommand($reference, 0));
        $bus->run(new RetireAgentCommand($holder->id));
        $this->assertFalse(AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->exists());

        $this->journal->actAsAgentIds($outsider->id, TestIds::of(91));
        $this->assertThrows(fn () => $this->app->make(AskRecords::class)->read($reference), RecordUnavailable::class);
        $this->journal->actAsAgentIds($holder->id, TestIds::of(92));
        $this->assertSame($ask->id, $this->app->make(AskRecords::class)->read($reference)->id);
    }

    public function test_a_symbolic_profile_without_helpers_is_unavailable_and_the_submission_key_replays(): void
    {
        $this->activateProfiles();
        $requester = $this->journal->idleAgent('Requester', 'journal-worker')->agentCalled('Requester');
        $target = SupervisorTarget::parse('profile:journal-code-reviewer');
        $ask = $this->retainFor($requester, $target);
        $again = $this->retainFor($requester, $target, routeVersion: 1);

        $this->assertSame($ask->id, $again->id);
        $this->assertSame($ask->work, $again->work);
        $this->assertSame(
            AskRouteStatus::Unavailable,
            $this->app->make(CommandBus::class)->run(new RouteAskCommand(new AskReference($ask->id), 0)),
        );
        $this->assertFalse(AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->exists());
    }

    private function activateProfiles(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
    }

    private function retainFor(Agent $requester, SupervisorTarget $target, int $routeVersion = 0): Ask
    {
        $actor = ActorReference::of($requester);
        $type = $this->app->make(AskTypeRegistry::class)->get(AskTypeKey::of('question'));
        $this->app->make(CommandBus::class)->run(
            new ChangeSupervisorCommand($actor, $target, $routeVersion, $type->key()),
        );
        $reference = Ask::resolveNewReference();

        return Ask::create(
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
