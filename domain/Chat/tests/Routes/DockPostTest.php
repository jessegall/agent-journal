<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Values\DockResult;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner docks a task above one of their chats.
 */
#[TestsRoute('POST', 'chat.dock')]
final class DockPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $inbox = $journal->owner()->inboxCalled('Owner');
        $taskId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->payload([
                'inboxId' => $inbox->id,
                'type' => 'tasks.task',
                'id' => $taskId,
            ])
            ->reply(DockSourceCommand::class, DockResult::of(DockOutcome::Added, strtolower((string) Str::ulid())))
            ->expects(DockSourceCommand::class, [
                'chat' => $inbox->id,
                'type' => 'tasks.task',
                'id' => $taskId,
            ]);
    }
}
