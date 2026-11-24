<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\ReservedCommands;

use App\Contracts\Bus\CommandBus;
use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Support\RecordIdentity;

/**
 * A handler that runs an ordinary command, which the reserved commands check allows.
 */
final readonly class RunsAnOrdinaryCommand
{
    public function __construct(private CommandBus $commands) {}

    public function handle(RecordIdentity $source, RecordIdentity $target): void
    {
        $this->commands->run(new UnlinkRecordsCommand($source, $target));
    }
}
