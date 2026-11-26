<?php

declare(strict_types=1);

namespace Tests\Architecture\Seeding;

use App\Commands\Messages\ReadUnreadMessages\ReadUnreadMessagesCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Actors\CurrentActor;
use App\Support\Access\AccessSettings;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\CommandRegistry;
use App\Support\ShownMessage;
use App\Values\StackTarget;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Who the journal acts and runs a command as: a user or agent known only by its ids, the agent of a stack target, the
 * owner or a named actor for one command with the actor in place put back after, and the agent of a start the
 * journal signed for.
 */
final class JournalActingTest extends TestCase
{
    use CommitsHookRows;

    protected const array TABLES = [];

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
