<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\ReservedCommands;

use App\Bus\Contracts\CommandBus;
use App\Records\Commands\UnlinkRecords;
use App\Records\Support\RecordIdentity;

/**
 * A handler that runs an ordinary command, which the reserved commands check allows.
 */
final readonly class RunsAnOrdinaryCommand
{
    public function __construct(private CommandBus $commands) {}

    public function handle(RecordIdentity $source, RecordIdentity $target): void
    {
        $this->commands->run(new UnlinkRecords($source, $target));
    }
}
