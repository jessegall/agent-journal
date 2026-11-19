<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\CleanProcessOutputHandler;
use App\Processes\Values\CleanPreview;

/**
 * A user removes the stored output of ended runs, after seeing a preview of what goes; their parts say the output
 * was removed and their receipts stay.
 *
 * @implements Command<CleanPreview>
 */
#[HandledBy(CleanProcessOutputHandler::class)]
final readonly class CleanProcessOutput implements Command
{
    /**
     * @param  list<string>  $runIds
     */
    public function __construct(public array $runIds, public bool $preview) {}
}
