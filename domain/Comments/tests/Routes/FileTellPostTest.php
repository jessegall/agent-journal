<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Routes;

use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use Domain\Chat\Support\PairChats;
use Domain\Comments\CommentsDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner tells an agent, in their pair chat, about a comment on lines of a file.
 */
#[TestsRoute('POST', 'comments.file-tell')]
final class FileTellPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->idleAgent('Builder');
        $inboxId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->payload([
                'agent' => $journal->agentCalled('Builder')->id,
                'path' => 'app/Kernel.php',
                'first_line' => 1,
                'last_line' => 2,
                'comment' => 'Why is this here?',
            ])
            ->reply(OpenInboxCommand::class, $inboxId)
            ->reply(SendMessageCommand::class, Str::ulid())
            ->expects(OpenInboxCommand::class, [
                'providerKey' => PairChats::PAIR_PROVIDER,
            ])
            ->expects(SendMessageCommand::class, [
                'inboxId' => $inboxId,
            ]);
    }
}
