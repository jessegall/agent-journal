<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\UndockSource\UndockSourceCommand;
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
 * The owner takes a placement off the dock of one of their chats.
 */
#[TestsRoute('POST', 'chat.undock')]
final class UndockPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $inbox = $journal->owner()->inboxCalled('Owner');
        $placementId = strtolower((string) Str::ulid());
        $taskId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->payload([
                'inboxId' => $inbox->id,
                'placementId' => $placementId,
                'type' => 'tasks.task',
                'id' => $taskId,
            ])
            ->reply(UndockSourceCommand::class, DockResult::of(DockOutcome::Removed, $placementId))
            ->expects(UndockSourceCommand::class, [
                'chat' => $inbox->id,
                'placementId' => $placementId,
                'type' => 'tasks.task',
                'id' => $taskId,
            ]);
    }
}
