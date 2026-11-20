<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\InboxUnavailable;
use App\Records\Exceptions\RecordUnavailable;
use Domain\Chat\Commands\RestoreDockedRecord;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Support\DockableRecords;

final readonly class RestoreDockedRecordHandler extends ChatCommandHandler
{
    public function __construct(
        private DockableRecords $dockable,
    ) {}

    /**
     * @throws InboxUnavailable
     * @throws RecordUnavailable
     */
    public function handle(RestoreDockedRecord $command): void
    {
        $this->dockable->requireIn($command->conversation(), $command->record);
        $owner = ActorIdentity::of($command->dispatchedBy());
        DockedRecord::placed($owner, $command->conversation(), $command->record)?->restore();
    }
}
