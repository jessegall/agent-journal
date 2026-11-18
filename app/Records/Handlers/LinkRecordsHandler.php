<?php

declare(strict_types=1);

namespace App\Records\Handlers;

use App\Records\Commands\LinkRecords;
use App\Records\Contracts\RecordLinker;

final readonly class LinkRecordsHandler
{
    public function __construct(private RecordLinker $links) {}

    public function handle(LinkRecords $command): void
    {
        $this->links->link($command->source, $command->target);
    }
}
