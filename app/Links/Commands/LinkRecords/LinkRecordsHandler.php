<?php

declare(strict_types=1);

namespace App\Links\Commands\LinkRecords;

use App\Bus\Contracts\CommandHandler;
use App\Records\Contracts\RecordLinker;

final readonly class LinkRecordsHandler implements CommandHandler
{
    public function __construct(private RecordLinker $links) {}

    public function handle(LinkRecordsCommand $command): void
    {
        $this->links->link($command->source, $command->target);
    }
}
