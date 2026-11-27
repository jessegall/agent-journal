<?php

declare(strict_types=1);

namespace Tests\States;

use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageRead;
use App\Events\Messages\MessageSent;
use App\Hooks\Enums\AnswerType;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Processes\Contracts\ShellCommandParser;
use App\Projects\Contracts\AgentProjects;
use App\Projects\Contracts\CurrentProject as CurrentProjectContract;
use App\Projects\CurrentProject;
use App\Resolvers\AgentDirectory;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Stacks\ReadMessageState;
use App\Stacks\Support\AnswerMessageStateReference;
use App\Stacks\Support\ReadMessageStateReference;
use App\Stacks\Values\AnswerBudget;
use App\Support\ActorReference;
use App\Values\ProjectSelection;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Fixtures\Projects\AskedAgentProjects;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHook;
use Tests\Support\Seeding\StateHandle;
use Tests\TestCase;

/**
 * The read message state on the real engine: it starts with the inbox's messages its agent has not read, takes in
 * each new one someone else sends, pushes the answering state for each message the agent reads, and ends once
 * nothing is unread or the agent leaves the inbox; once the budget is spent it refuses writes and the stop.
 */
#[TestsState(ReadMessageState::class)]
final class ReadMessageStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts'];

    private Inbox $inbox;

    private Message $first;

    private Message $second;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AnswerBudget::class, new AnswerBudget(2));
        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $this->journal->owner()->agent('Writer')->agent('Other')->sharedInbox('Owner', 'Writer');
        $this->inbox = $this->journal->sharedInboxOf('Owner', 'Writer');
        $this->first = $this->journal->post('Owner', $this->inbox, 'First');
        $this->second = $this->journal->post('Owner', $this->inbox, 'Second');
    }

    public function test_it_starts_with_every_message_its_agent_has_not_read(): void
    {
        $this->journal
            ->pushState('Writer', $this->reading())
            ->stateOn('Writer', $this->reading(), fn (StateHandle $reading) => $reading->event(
                new MessageSent('sent-9', 'inbox-9', 9, null, $this->journal->actorCalled('Owner')),
                fn (StateAssert $state) => $state->where('unreadIds', [$this->first->id, $this->second->id]),
            ));
    }

    public function test_an_inbox_with_nothing_unread_ends_it_as_it_enters(): void
    {
        $this->journal->sharedInbox('Owner', 'Other');
        $other = $this->journal->agentCalled('Other')->id;
        $quiet = ReadMessageStateReference::forInbox($this->journal->sharedInboxOf('Owner', 'Other')->id, $other);

        $this->journal->pushState('Other', $quiet)->stateOn('Other', $quiet, fn (StateHandle $empty) => $empty
            ->tick(fn (StateAssert $state) => $state->isFinished()));
    }

    public function test_a_message_someone_else_sends_waits_to_be_read_and_its_agents_own_does_not(): void
    {
        $this->journal
            ->pushState('Writer', $this->reading())
            ->stateOn('Writer', $this->reading(), fn (StateHandle $reading) => $reading
                ->event(
                    new MessageSent('sent-1', $this->inbox->id, 3, null, $this->agent()),
                    fn (StateAssert $state) => $state->where('unreadIds', [$this->first->id, $this->second->id]),
                )
                ->event(
                    new MessageSent('sent-2', $this->inbox->id, 4, null, $this->journal->actorCalled('Owner')),
                    fn (StateAssert $state) => $state->where(
                        'unreadIds',
                        [$this->first->id, $this->second->id, 'sent-2'],
                    ),
                ));
    }

    public function test_each_read_pushes_the_answer_for_that_message_and_the_last_ends_it(): void
    {
        $this->journal
            ->pushState('Writer', $this->reading())
            ->stateOn('Writer', $this->reading(), fn (StateHandle $reading) => $reading
                ->event(
                    new MessageRead($this->first->id, $this->inbox->id, $this->journal->actorCalled('Other')),
                    fn (StateAssert $state) => $state->stackIs(
                        ['core.ready', StateReferenceKeys::of(ReadMessageStateReference::class)],
                    ),
                )
                ->event(new MessageRead(
                    $this->first->id,
                    $this->inbox->id,
                    $this->agent(),
                ), fn (StateAssert $state) => $state
                    ->pushed(AnswerMessageStateReference::forMessage($this->first, $this->writerId()))
                    ->where('unreadIds', [$this->second->id]))
                ->event(
                    new MessageRead($this->second->id, $this->inbox->id, $this->agent()),
                    fn (StateAssert $state) => $state->isFinished(),
                ));
    }

    public function test_the_agent_leaving_the_inbox_ends_it(): void
    {
        $this->journal
            ->pushState('Writer', $this->reading())
            ->stateOn('Writer', $this->reading(), fn (StateHandle $reading) => $reading
                ->event(new InboxLeft('inbox-9', $this->agent()), fn (StateAssert $state) => $state->isLive())
                ->event(
                    new InboxLeft($this->inbox->id, $this->agent()),
                    fn (StateAssert $state) => $state->isFinished(),
                ));
    }

    public function test_once_the_budget_is_spent_it_refuses_writes_but_not_reads_until_the_agent_reads(): void
    {
        $this->journal
            ->pushState('Writer', $this->reading())
            ->stateOn('Writer', $this->reading(), fn (StateHandle $reading) => $reading
                ->fileEdit(
                    'app/Thing.php',
                    fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
                )
                ->steps([
                    SessionHook::toolFinished(),
                    SessionHook::toolFinished('pwd'),
                    SessionHook::shell('composer update'),
                ], fn (StateAssert $state) => $state
                    ->where('toolUses', 2)
                    ->answers(AnswerType::Deny))
                ->shell(
                    'git status',
                    fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
                )
                ->event(
                    new MessageRead($this->first->id, $this->inbox->id, $this->agent()),
                    fn (StateAssert $state) => $state->where('toolUses', 0),
                ));
    }

    public function test_a_stop_is_refused_while_a_message_is_unread_and_passes_right_after_a_refusal(): void
    {
        $this->journal
            ->pushState('Writer', $this->reading())
            ->stateOn('Writer', $this->reading(), fn (StateHandle $reading) => $reading
                ->stop(fn (StateAssert $state) => $state->answers(AnswerType::Deny))
                ->stopAfterRefusal(
                    fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
                ));
    }

    public function test_a_send_by_an_owner_on_another_project_is_read_under_the_agents_own_project(): void
    {
        $this->journal->project('Shop');
        $asked = new AskedAgentProjects($this->app->make(AgentDirectory::class));
        $this->app->instance(AgentProjects::class, $asked);
        $this->app->forgetInstance(CurrentProject::class);
        $chosen = ProjectSelection::of($this->journal->projectCalled('Shop')->id);
        $this->app->make(CurrentProject::class)->select($chosen);

        $this->journal
            ->pushState('Writer', $this->reading())
            ->stateOn('Writer', $this->reading(), fn (StateHandle $reading) => $reading->event(
                new MessageSent('sent-3', $this->inbox->id, 3, null, $this->journal->actorCalled('Owner')),
                fn (StateAssert $state) => $state->where(
                    'unreadIds',
                    [$this->first->id, $this->second->id, 'sent-3'],
                ),
            ));

        $this->assertContains($this->writerId(), $asked->askedAgentIds);
        $this->assertEquals($chosen, $this->app->make(CurrentProjectContract::class)->selection());
    }

    private function reading(): ReadMessageStateReference
    {
        return ReadMessageStateReference::forInbox($this->inbox->id, $this->writerId());
    }

    private function agent(): ActorReference
    {
        return $this->journal->actorCalled('Writer');
    }

    private function writerId(): string
    {
        return $this->journal->agentCalled('Writer')->id;
    }
}
