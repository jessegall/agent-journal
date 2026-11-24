<?php

declare(strict_types=1);

namespace App\Commands\Links\UnlinkRecords;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Records\RecordLinker;

final readonly class UnlinkRecordsHandler implements CommandHandler
{
    public function __construct(private RecordLinker $links) {}

    public function handle(UnlinkRecordsCommand $command): void
    {
        $this->links->unlink($command->source, $command->target);
    }
}
