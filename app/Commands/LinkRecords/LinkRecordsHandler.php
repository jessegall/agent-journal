<?php

declare(strict_types=1);

namespace App\Commands\LinkRecords;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Records\RecordLinker;

final readonly class LinkRecordsHandler implements CommandHandler
{
    public function __construct(private RecordLinker $links) {}

    public function handle(LinkRecordsCommand $command): void
    {
        $this->links->link($command->source, $command->target);
    }
}
