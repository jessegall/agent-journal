<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\InboxUnavailable;
use App\Contracts\CommandHandler;
use App\Records\Exceptions\RecordUnavailable;
use Domain\Chat\Commands\HideDockedRecord;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Support\DockableRecords;

final readonly class HideDockedRecordHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private DockableRecords $dockable,
    ) {}

    /**
     * @throws InboxUnavailable
     * @throws RecordUnavailable
     */
    public function handle(HideDockedRecord $command): void
    {
        $this->dockable->requireIn($command->conversation(), $command->record);
        $owner = ActorIdentity::of($this->actors->actor());
        DockedRecord::placed($owner, $command->conversation(), $command->record)?->hide();
    }
}
