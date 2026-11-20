<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands;

use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Models\FixtureWork;

/**
 * @extends Command<void>
 */
abstract readonly class TaskWatchRecord extends Command implements AuthorizedCommand
{
    public function __construct(public string $taskId, public int $watchNumber) {}

    public function subject(): string
    {
        return FixtureWork::class;
    }
}
