<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\CreateGroupChat;
use Domain\Chat\Commands\DockSource;
use Domain\Chat\Data\DockPageData;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\DockProjection;
use Domain\Tasks\Models\Task;
use Tests\Support\MessagingTestCase;

/**
 * A docked source shows to each member only as far as that member may read it: the owner sees a docked task, a chat
 * member who may not read tasks sees no title or body of it.
 */
final class ChatDockPermissionTest extends MessagingTestCase
{
    public function test_a_docked_task_shows_to_the_owner_and_not_to_a_chat_member(): void
    {
        $bea = User::factory()->create(['name' => 'Bea']);
        EnvironmentUserGrant::grant(
            $bea,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($bea));
        $task = Task::factory()->create(['title' => 'Ship the release']);

        $this->asOwner();
        $inboxId = $this->runOnBus(new CreateGroupChat('Design', [$bea->id]));
        $this->runOnBus(new DockSource($inboxId, 'tasks.task', $task->id));
        $chat = Conversation::forInbox($inboxId);

        $this->assertCount(1, $this->pageAs($chat)->cards);

        $this->startUserRequestAs($bea->id);
        $shown = (string) json_encode($this->pageAs($chat));

        $this->assertStringNotContainsString('Ship the release', $shown);
    }

    private function pageAs(Conversation $chat): DockPageData
    {
        $this->app->forgetScopedInstances();

        return $this->app->make(DockProjection::class)->page($chat, null);
    }
}
