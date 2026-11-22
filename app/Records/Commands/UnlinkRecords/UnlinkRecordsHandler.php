<?php

declare(strict_types=1);

namespace App\Records\Commands\UnlinkRecords;

use App\Contracts\CommandHandler;
use App\Records\Contracts\RecordLinker;

final readonly class UnlinkRecordsHandler implements CommandHandler
{
    public function __construct(private RecordLinker $links) {}

    public function handle(UnlinkRecordsCommand $command): void
    {
        $this->links->unlink($command->source, $command->target);
    }
}
