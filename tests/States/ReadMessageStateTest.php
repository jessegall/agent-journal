<?php

declare(strict_types=1);

namespace Tests\States;

use App\Contracts\Processes\ShellCommandParser;
use App\Enums\Hooks\AnswerType;
use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageRead;
use App\Events\Messages\MessageSent;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Support\ActorReference;
use App\Support\States\ReadMessageState;
use App\Support\States\Support\AnswerMessageStateReference;
use App\Support\States\Support\ReadMessageStateReference;
use App\Values\AnswerBudget;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\ScenarioTick;
use Tests\Support\Seeding\SessionHooks;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;
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

    private SessionHooks $hooks;

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
        $this->hooks = $this->journal->hooksFor($this->journal->sessionOf('Writer'));
    }

    public function test_it_starts_with_every_message_its_agent_has_not_read(): void
    {
        $this->reading()->given(
            new MessageSent('sent-9', 'inbox-9', 9, null, $this->journal->actorCalled('Owner')),
            fn (StateObservation $state) => $state->assertValue('unreadIds', [$this->first->id, $this->second->id]),
        );
    }

    public function test_an_inbox_with_nothing_unread_ends_it_as_it_enters(): void
    {
        $this->journal->sharedInbox('Owner', 'Other');
        $quiet = $this->journal->sharedInboxOf('Owner', 'Other');
        $other = $this->journal->agentCalled('Other')->id;

        $this->journal
            ->pushState($this->journal->sessionOf('Other'), ReadMessageStateReference::forInbox($quiet->id, $other))
            ->given(new ScenarioTick(), fn (StateObservation $state) => $state->assertFinished());
    }

    public function test_a_message_someone_else_sends_waits_to_be_read_and_its_agents_own_does_not(): void
    {
        $this->reading()
            ->given(
                new MessageSent('sent-1', $this->inbox->id, 3, null, $this->agent()),
                fn (StateObservation $state) => $state->assertValue('unreadIds', [$this->first->id, $this->second->id]),
            )
            ->given(
                new MessageSent('sent-2', $this->inbox->id, 4, null, $this->journal->actorCalled('Owner')),
                fn (StateObservation $state) => $state->assertValue(
                    'unreadIds',
                    [$this->first->id, $this->second->id, 'sent-2'],
                ),
            );
    }

    public function test_each_read_pushes_the_answer_for_that_message_and_the_last_ends_it(): void
    {
        $this->reading()
            ->given(
                new MessageRead($this->first->id, $this->inbox->id, $this->journal->actorCalled('Other')),
                fn (StateObservation $state) => $state->assertStack(
                    ['core.ready', ReadMessageStateReference::TYPE_KEY],
                ),
            )
            ->given(new MessageRead(
                $this->first->id,
                $this->inbox->id,
                $this->agent(),
            ), function (StateObservation $state) {
                $state->assertPushed(AnswerMessageStateReference::forMessage($this->first, $this->writerId()));
                $state->assertValue('unreadIds', [$this->second->id]);
            })
            ->given(
                new MessageRead($this->second->id, $this->inbox->id, $this->agent()),
                fn (StateObservation $state) => $state->assertFinished(),
            );
    }

    public function test_the_agent_leaving_the_inbox_ends_it(): void
    {
        $this->reading()
            ->given(new InboxLeft('inbox-9', $this->agent()), fn (StateObservation $state) => $state->assertLive())
            ->given(
                new InboxLeft($this->inbox->id, $this->agent()),
                fn (StateObservation $state) => $state->assertFinished(),
            );
    }

    public function test_once_the_budget_is_spent_it_refuses_writes_but_not_reads_until_the_agent_reads(): void
    {
        $this->reading()
            ->given(
                $this->hooks->fileEdit('app/Thing.php'),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
            )
            ->given([
                $this->hooks->toolFinished(),
                $this->hooks->toolFinished('pwd'),
                $this->hooks->shell('composer update'),
            ], function (StateObservation $state) {
                $state->assertValue('toolUses', 2);
                $state->assertStateAnswer(AnswerType::Deny);
            })
            ->given(
                $this->hooks->shell('git status'),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
            )
            ->given(
                new MessageRead($this->first->id, $this->inbox->id, $this->agent()),
                fn (StateObservation $state) => $state->assertValue('toolUses', 0),
            );
    }

    public function test_a_stop_is_refused_while_a_message_is_unread_and_passes_right_after_a_refusal(): void
    {
        $this->reading()
            ->given($this->hooks->stop(), fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny))
            ->given(
                $this->hooks->stopAfterRefusal(),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
            );
    }

    private function reading(): StateHandle
    {
        return $this->journal->pushState(
            $this->journal->sessionOf('Writer'),
            ReadMessageStateReference::forInbox($this->inbox->id, $this->writerId()),
        );
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
