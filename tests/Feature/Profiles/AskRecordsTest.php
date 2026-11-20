<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\RetireAgent;
use App\Agents\Models\Agent;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Exceptions\AssignmentTypeInternal;
use App\Assignments\Models\AssignmentRecord;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Exceptions\SupervisorRouteInvalid;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\SupervisorTarget;
use App\Records\Exceptions\RecordUnavailable;
use App\Supervision\Commands\ChangeSupervisor;
use App\Supervision\Commands\RouteAsk;
use App\Supervision\Enums\AskRouteStatus;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskHop;
use App\Supervision\Support\AskRecords;
use App\Supervision\Support\AskTypeRegistry;
use App\Supervision\Values\AskReference;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

final class AskRecordsTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'ask_hops', 'asks', 'supervisor_changes', 'supervisor_links',
        'assignments', 'agents', 'profile_revisions', 'profiles',
    ];

    public function test_the_internal_route_holds_an_ask_and_public_assignment_cannot_change_it(): void
    {
        $this->activateProfiles();
        $requester = Agent::named('Requester', 'journal-worker');
        $holder = Agent::named('Supervisor', 'journal-code-reviewer');
        $ask = $this->retainFor($requester, SupervisorTarget::forActor(ActorIdentity::of($holder)));
        $record = $ask->assignmentIdentity();
        $bus = $this->app->make(CommandBus::class);
        $keys = $this->app->make(RequestKey::class);
        $keys->set('public-assign-ask');

        $this->assertThrows(
            fn () => $bus->run(new AssignRecord($record, $holder->assigneeIdentity())),
            AssignmentTypeInternal::class,
        );
        $keys->forget();
        $this->assertSame(AskRouteStatus::Assigned, $bus->run(new RouteAsk(new AskReference($ask->id), 0)));
        $assignment = AssignmentRecord::query()->forRecord($record)->firstOrFail()->toAssignment();
        $this->assertTrue($assignment->holder()->isSameAs($holder->assigneeIdentity()));
        $this->assertSame(1, AskHop::query()->count());
        $keys->set('public-reassign-ask');
        $this->assertThrows(
            fn () => $bus->run(new ReassignRecord($record, $assignment->reference, $requester->assigneeIdentity())),
            AssignmentTypeInternal::class,
        );
    }

    public function test_an_unrelated_actor_sees_nothing_while_a_former_holder_can_still_read_the_ask(): void
    {
        $this->activateProfiles();
        $requester = Agent::named('Requester', 'journal-worker');
        $holder = Agent::named('Supervisor', 'journal-code-reviewer');
        $outsider = Agent::named('Other', 'journal-code-reviewer');
        $ask = $this->retainFor($requester, SupervisorTarget::forActor(ActorIdentity::of($holder)));
        $reference = new AskReference($ask->id);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new RouteAsk($reference, 0));
        $bus->run(new RetireAgent($holder->id));
        $this->assertFalse(AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->exists());

        $this->startRequestAs($outsider->id, TestIds::of(91));
        $this->assertThrows(fn () => $this->app->make(AskRecords::class)->read($reference), RecordUnavailable::class);
        $this->startRequestAs($holder->id, TestIds::of(92));
        $this->assertSame($ask->id, $this->app->make(AskRecords::class)->read($reference)->id);
    }

    public function test_a_symbolic_profile_keeps_the_ask_pending_and_the_submission_key_replays(): void
    {
        $this->activateProfiles();
        $requester = Agent::named('Requester', 'journal-worker');
        $target = SupervisorTarget::parse('profile:journal-code-reviewer');
        $ask = $this->retainFor($requester, $target);
        $again = $this->retainFor($requester, $target, routeVersion: 1);

        $this->assertSame($ask->id, $again->id);
        $this->assertSame($ask->work, $again->work);
        $this->assertSame(
            AskRouteStatus::PendingProfile,
            $this->app->make(CommandBus::class)->run(new RouteAsk(new AskReference($ask->id), 0)),
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

    private function activateProfiles(): void
    {
        $this->startTestUserRequest(1);
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
    }

    private function retainFor(Agent $requester, SupervisorTarget $target, int $routeVersion = 0): Ask
    {
        $actor = ActorIdentity::of($requester);
        $type = $this->app->make(AskTypeRegistry::class)->get(AskTypeKey::from('question'));
        $this->app->make(CommandBus::class)->run(new ChangeSupervisor($actor, $target, $routeVersion, $type->key()));
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
