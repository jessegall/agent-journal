<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Access\AccessSettings;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Messages\Commands\ReadUnreadMessages\ReadUnreadMessagesCommand;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Messages\ShownMessage;
use App\Projects\CurrentProject;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\CommandRegistry;
use App\Values\ProjectSelection;
use App\Values\StackTarget;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;
use Tests\TestCase;

/**
 * Who the journal acts and runs a command as: a user or agent known only by its ids, the agent of a stack target, the
 * owner or a named actor for one command with the actor in place put back after, and the agent of a start the
 * journal signed for.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalActingTest extends TestCase
{
    use CommitsHookRows;

    protected const array TABLES = ['projects', 'project_environments'];

    public function test_a_user_known_by_id_acts_and_stands_in_as_owner_while_the_journal_has_none(): void
    {
        $this->journal->actAsUserId('user-1');

        $this->assertActor(ActorReference::forUser('user-1'));
        $this->assertSame('user-1', $this->app->make(AccessSettings::class)->ownerId);
    }

    public function test_an_agent_known_by_id_acts_with_or_without_its_session(): void
    {
        $this->journal->actAsAgentId('agent-1');
        $this->assertActor(ActorReference::forAgent('agent-1'));

        $this->journal->actAsAgentIds('agent-2', 'session-2');
        $this->assertActor(ActorReference::forAgent('agent-2'));
        $this->assertSame('session-2', $this->app->make(AgentContext::class)->sessionId);

        $this->journal->actAsAgentOf(new StackTarget('agent-3', 'session-3'));
        $this->assertActor(ActorReference::forAgent('agent-3'));
        $this->assertSame('session-3', $this->app->make(AgentContext::class)->sessionId);
    }

    public function test_an_agent_known_only_by_id_works_in_the_local_project_once_bare_agents_are_placed_there(): void
    {
        $this->journal->placeBareAgentsInLocalProject()->actAsAgentId('agent-1');

        $this->assertEquals(
            ProjectSelection::of(TestProjects::local()->id),
            $this->app->make(CurrentProject::class)->selection(),
        );
    }

    public function test_an_agent_with_a_row_keeps_its_own_project_when_bare_agents_are_placed_locally(): void
    {
        $this->journal->placeBareAgentsInLocalProject()->owner()->project('Shop')->agent('Cy', 'main-agent', 'Shop')
            ->actAs('Cy');

        $this->assertEquals(
            ProjectSelection::of($this->journal->projectCalled('Shop')->id),
            $this->app->make(CurrentProject::class)->selection(),
        );
    }

    public function test_the_owner_reads_the_project_the_browser_chose_or_all_of_them(): void
    {
        $this->journal->owner()->project('Shop')->selectProject('Shop');
        $this->assertEquals(
            ProjectSelection::of($this->journal->projectCalled('Shop')->id),
            $this->app->make(CurrentProject::class)->selection(),
        );

        $this->journal->inAllProjects();
        $this->assertEquals(ProjectSelection::all(), $this->app->make(CurrentProject::class)->selection());
    }

    public function test_the_actor_in_place_comes_back_after_a_request_the_test_sends_itself(): void
    {
        $this->journal->owner();

        $this->get('/up');

        $this->assertActor(ActorReference::of($this->journal->ownerUser()));
    }

    public function test_reselecting_puts_back_the_actor_the_journal_had_in_place(): void
    {
        $this->journal->owner();
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('stranger'), new OwnerAuthority('test'));

        $this->journal->reselect();

        $this->assertActor(ActorReference::of($this->journal->ownerUser()));
    }

    public function test_a_command_run_as_a_named_actor_is_sent_by_them_and_the_actor_in_place_comes_back(): void
    {
        $this->journal->owner()->agent('Ada')->sharedInbox('Owner', 'Ada')->actAs('Owner');
        $inbox = $this->journal->sharedInboxOf('Owner', 'Ada');

        $this->journal->runAs('Ada', new SendMessageCommand($inbox->id, 'From Ada.'));

        $this->journal->assertMessageSent($inbox, 'Ada', 'From Ada.');
        $this->assertActor(ActorReference::of($this->journal->ownerUser()));
    }

    public function test_a_command_run_as_the_owner_is_the_owners_and_the_agent_acts_again_after(): void
    {
        $this->journal->owner()->agent('Ada')->sharedInbox('Owner', 'Ada')->actAs('Ada');
        $inbox = $this->journal->sharedInboxOf('Owner', 'Ada');

        $this->journal->asOwner(new SendMessageCommand($inbox->id, 'From the owner.'));

        $this->journal->assertMessageSent($inbox, 'Owner', 'From the owner.');
        $this->assertActor(ActorReference::forAgent($this->journal->agentCalled('Ada')->id));
    }

    public function test_a_command_run_as_an_agent_id_or_a_start_is_that_agents_and_leaves_it_acting(): void
    {
        $this->journal->owner()->agent('Ada')->agent('Bea')->sharedInbox('Owner', 'Ada')->sharedInbox('Owner', 'Bea');
        $this->journal->post('Owner', $this->journal->sharedInboxOf('Owner', 'Ada'), 'For Ada.');
        $this->journal->post('Owner', $this->journal->sharedInboxOf('Owner', 'Bea'), 'For Bea.');
        $ada = $this->journal->agentCalled('Ada')->id;

        $byId = $this->journal->runAsAgentId($ada, new ReadUnreadMessagesCommand());
        $this->assertSame(['For Ada.'], array_map(fn (ShownMessage $shown) => $shown->body, $byId->messages));
        $this->assertActor(ActorReference::forAgent($ada));

        $byStart = $this->journal->runAsStart($this->journal->testStartCalled('Bea'), new ReadUnreadMessagesCommand());
        $this->assertSame(['For Bea.'], array_map(fn (ShownMessage $shown) => $shown->body, $byStart->messages));
        $this->assertActor(ActorReference::forAgent($this->journal->agentCalled('Bea')->id));
    }

    public function test_a_signed_start_is_a_new_agent_started_once_under_its_name(): void
    {
        $this->journal->owner();

        $start = $this->journal->signedStart('Writer', 'writing-helper');

        $this->assertSame(
            [$this->journal->agentCalled('Writer')->id, $this->journal->sessionOf('Writer')->id, 'writing-helper'],
            [$start->agent->id, $start->session->id, $start->agent->profile_key],
        );
        $this->assertSame($start->token, $this->journal->startCalled('Writer')->token);
    }

    public function test_a_name_is_found_as_the_agent_or_the_user_it_names(): void
    {
        $this->journal->owner()->user('Sam')->idleAgent('Ada');

        $this->assertSame($this->journal->agentCalled('Ada'), $this->journal->userOrAgentCalled('Ada'));
        $this->assertSame($this->journal->userCalled('Sam'), $this->journal->userOrAgentCalled('Sam'));
    }

    public function test_a_service_is_the_applications_own(): void
    {
        $this->assertSame($this->app->make(CommandRegistry::class), $this->journal->service(CommandRegistry::class));
    }

    private function assertActor(ActorReference $expected): void
    {
        $this->assertEquals($expected, $this->app->make(CurrentActor::class)->actor());
    }
}
