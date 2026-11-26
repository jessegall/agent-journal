<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\React\ReactCommand;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner reacts to an agent's message in their chat, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.react')]
final class ReactPostTest extends GuardedRouteEntryTestCase
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

        $messageId = $journal->actAsAgentIds($start->agent->id, $start->session->id)
            ->run(new SendMessageCommand($inbox->id, 'Which port?'));

        $journal->actAs('Owner');

        return RouteCall::recorded('chat-react', [
            '01JPAGEREQUESTINBOX0000000' => $inbox->id,
            '01JPAGEREQUESTMESSAGE00000' => $messageId,
        ])
            ->reply(ReactCommand::class, Str::ulid())
            ->expects(ReactCommand::class, [
                'messageId' => $messageId,
                'emoji' => '👍',
            ]);
    }
}
