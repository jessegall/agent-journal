<?php

declare(strict_types=1);

namespace App\Records\Handlers;

use App\Records\Commands\UnlinkRecords;
use App\Records\Contracts\RecordLinker;

final readonly class UnlinkRecordsHandler
{
    public function __construct(private RecordLinker $links) {}

    public function handle(UnlinkRecords $command): void
    {
        $this->links->unlink($command->source, $command->target);
    }
}
