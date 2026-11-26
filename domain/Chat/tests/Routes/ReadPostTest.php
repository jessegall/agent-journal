<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Commands\Messages\ReadMessage\ReadMessageCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Models\Messages\Message;
use App\Support\ShownMessage;
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

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Ada');
        $chats = $journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Ada');
        $inbox = $chats->pairChatOf('Owner', 'Ada');
        $messageId = $journal->runAsStart($start, new SendMessageCommand($inbox->id, 'Which port?'));
        $journal->actAs('Owner');

        return RouteCall::recorded('chat-read', [
            '01JPAGEREQUESTINBOX0000000' => $inbox->id,
            '01JPAGEREQUESTMESSAGE00000' => $messageId,
        ])
            ->reply(ReadMessageCommand::class, ShownMessage::of(Message::query()->findOrFail($messageId)))
            ->expects(ReadMessageCommand::class, [
                'messageId' => $messageId,
            ]);
    }
}
