<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Messages\Commands\ReadMessage\ReadMessageCommand;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Messages\ShownMessage;
use App\Models\Messages\Message;
use Domain\Chat\ChatDomain;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner reads an agent's message the chat showed, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.read')]
final class ReadPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_declining_a_message_reads_it_as_the_chat_does(): void
    {
        $messageId = $this->questionOfAda($this->journal);

        $this->assertReachedAndDispatchesItsCommands($this->readOf(RouteCall::recorded('chat-decline', [
            '01JPAGEREQUESTINBOX0000000' => Message::query()->findOrFail($messageId)->inbox_id,
            '01JPAGEREQUESTMESSAGE00000' => $messageId,
        ]), $messageId));
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $messageId = $this->questionOfAda($journal);

        return $this->readOf(RouteCall::recorded('chat-read', [
            '01JPAGEREQUESTINBOX0000000' => Message::query()->findOrFail($messageId)->inbox_id,
            '01JPAGEREQUESTMESSAGE00000' => $messageId,
        ]), $messageId);
    }

    /**
     * Ada asks the owner in their pair chat, and the owner acts again; the message's id.
     */
    private function questionOfAda(TestJournal $journal): string
    {
        $start = $journal->owner()->signedStart('Ada');
        $inbox = $journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Ada')->pairChatOf('Owner', 'Ada');

        $messageId = $journal->actAsAgentIds($start->agent->id, $start->session->id)
            ->run(new SendMessageCommand($inbox->id, 'Which port?'));

        $journal->actAs('Owner');

        return $messageId;
    }

    /**
     * The recorded call reads the message.
     */
    private function readOf(RouteCall $call, string $messageId): RouteCall
    {
        return $call
            ->reply(ReadMessageCommand::class, ShownMessage::of(Message::query()->findOrFail($messageId)))
            ->expects(ReadMessageCommand::class, ['messageId' => $messageId]);
    }
}
