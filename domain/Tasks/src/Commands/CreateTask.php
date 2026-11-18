<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\CreateTaskHandler;

/**
 * Creates an open task with its title and brief and answers its id; the task takes the journal's next task number
 * and records who created it.
 *
 * @implements Command<string>
 */
#[HandledBy(CreateTaskHandler::class)]
final readonly class CreateTask implements Command
{
    public function __construct(public string $title, public string $brief) {}
}
