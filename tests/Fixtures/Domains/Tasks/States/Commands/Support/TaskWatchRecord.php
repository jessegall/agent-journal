<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\Support;

use App\Bus\Support\Command;

/**
 * @extends Command<void>
 */
abstract readonly class TaskWatchRecord extends Command
{
    public function __construct(public string $taskId, public int $watchNumber) {}
}
