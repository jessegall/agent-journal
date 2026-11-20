<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use Tests\Fixtures\Domains\Tasks\States\Handlers\RecordFinishedTaskHandler;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchAbility;

#[HandledBy(RecordFinishedTaskHandler::class)]
#[Authorize(TaskWatchPolicy::class, TaskWatchAbility::Record)]
final readonly class RecordFinishedTask extends TaskWatchRecord {}
