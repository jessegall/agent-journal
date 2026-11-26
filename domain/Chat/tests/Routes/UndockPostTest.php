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

    public function test_undocking_on_chats_own_page_returns_to_that_page_and_its_dock_page(): void
    {
        $call = $this->arrangedCall();
        $this->journal->sinkCommands()->sinkReplies($call->replies);
        $chat = '/chat?agent=01m8b0000000000000000agent&dock=page-2';

        $this->journal->route('POST', 'chat.undock', payload: $call->payload, headers: ['referer' => $chat])
            ->assertRedirect($chat);
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
