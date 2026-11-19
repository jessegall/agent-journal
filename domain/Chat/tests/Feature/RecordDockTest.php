<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Communication\Models\Message;
use App\Records\Support\RecordIdentity;
use Domain\Chat\Commands\DockRecord;
use Domain\Chat\Commands\HideDockedRecord;
use Domain\Chat\Commands\RestoreDockedRecord;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Resolvers\Support\DockedRecordRecords;
use Domain\Chat\Support\ConversationPair;
use Domain\Chat\Tests\Support\OpensTeamDeskMessage;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * A docked record is its owner's placement in one conversation: docking, hiding and restoring change only that
 * placement, docking twice keeps one, and a record the owner can no longer read is left out while its placement stays.
 */
final class RecordDockTest extends TestCase
{
    use CommitsHookRows;
    use OpensTeamDeskMessage;
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'docked_records',
    ];

    public function test_docking_hiding_and_restoring_change_only_the_one_placement(): void
    {
        $this->asAgent($this->builder);
        $this->dock(new DockRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));
        $this->dock(new DockRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));

        $this->assertSame(1, DockedRecord::query()->withoutGlobalScopes()->count());
        $this->assertEquals([$this->record()], $this->docked(false));

        $this->dock(new HideDockedRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));
        $this->assertSame([], $this->docked(false));
        $this->assertEquals([$this->record()], $this->docked(true));

        $this->dock(new RestoreDockedRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));
        $this->assertEquals([$this->record()], $this->docked(false));
        $this->assertSame('Pin me.', Message::query()->withoutGlobalScopes()->findOrFail($this->messageId)->body);
    }

    public function test_an_unreadable_record_is_left_out_but_its_placement_stays(): void
    {
        $this->asAgent($this->builder);
        $this->dock(new DockRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));

        $this->replaceOccupant($this->reviewer[0]);
        $this->asAgent($this->builder);

        $this->assertSame([], $this->docked(false));
        $this->assertSame(1, DockedRecord::query()->withoutGlobalScopes()->count());
    }

    private function dock(object $command): void
    {
        $this->runOnBus($command);
    }

    /**
     * @return list<RecordIdentity>
     */
    private function docked(bool $hidden): array
    {
        return $this->app->make(DockedRecordRecords::class)->docked(
            new ConversationPair($this->ownInboxId, $this->desk->inboxId()),
            $hidden,
        );
    }

    private function record(): RecordIdentity
    {
        return new RecordIdentity(Message::LINK_TYPE, $this->messageId);
    }
}
