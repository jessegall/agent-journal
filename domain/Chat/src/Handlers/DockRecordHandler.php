<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\InboxUnavailable;
use App\Records\Exceptions\RecordUnavailable;
use Domain\Chat\Commands\DockRecord;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Support\DockableRecords;

final readonly class DockRecordHandler extends ChatCommandHandler
{
    public function __construct(
        private DockableRecords $dockable,
    ) {}

    /**
     * @throws InboxUnavailable
     * @throws RecordUnavailable
     */
    public function handle(DockRecord $command): void
    {
        $this->dockable->requireIn($command->conversation(), $command->record);
        $owner = ActorIdentity::of($command->dispatchedBy());
        $existing = DockedRecord::placed($owner, $command->conversation(), $command->record);

        if ($existing !== null) {
            $existing->restore();

            return;
        }

        DockedRecord::create($owner, $command->conversation(), $command->record);
    }
}
