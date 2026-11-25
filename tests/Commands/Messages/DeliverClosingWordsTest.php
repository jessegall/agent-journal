<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Commands\Messages\DeliverClosingWords\DeliverClosingWordsCommand;
use App\Commands\Messages\ReadMessage\ReadMessageCommand;
use App\Exceptions\ClosingWordsRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverTurn;
use App\Models\Messages\Message;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The words an agent's turn ended on are sent, once, to the inbox of the message it read last; with no words offered
 * or nothing read they are refused and nothing is sent.
 */
#[TestsCommand(DeliverClosingWordsCommand::class)]
final class DeliverClosingWordsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['messages', 'message_reads', 'driver_turns'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->sharedInbox('Owner', 'Planner');
    }

    public function test_the_words_go_once_to_the_inbox_of_the_last_read_message(): void
    {
        $asked = $this->journal->post('Owner', $this->journal->sharedInboxOf('Owner', 'Planner'), 'How far are you?');
        $this->journal->actAs('Planner')->run(new ReadMessageCommand($asked->id));
        $this->turn()->offerClosingWords('Half way.');

        $sent = $this->journal->run(new DeliverClosingWordsCommand());
        $again = $this->journal->run(new DeliverClosingWordsCommand());

        $this->assertSame($sent, $again);
        $reply = Message::query()->findOrFail($sent);
        $this->assertSame(['Half way.', $asked->inbox_id], [$reply->body, $reply->inbox_id]);
    }

    public function test_no_words_offered_and_nothing_read_are_refused(): void
    {
        $this->journal->actAs('Planner');
        $this->turn();

        $this->assertThrows(fn () => $this->journal->run(new DeliverClosingWordsCommand()), ClosingWordsRefused::class);

        $this->turn()->offerClosingWords('Half way.');

        $this->assertThrows(fn () => $this->journal->run(new DeliverClosingWordsCommand()), ClosingWordsRefused::class);
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    private function turn(): DriverTurn
    {
        $runtime = AgentRuntime::findForSession($this->journal->sessionOf('Planner')->id);

        return DriverTurn::create($runtime->id, $runtime->process_generation, 'prompt-1', CarbonImmutable::now());
    }
}
