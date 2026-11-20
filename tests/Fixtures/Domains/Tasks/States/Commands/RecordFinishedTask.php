<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use Tests\Fixtures\Domains\Tasks\States\Handlers\RecordFinishedTaskHandler;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchAbility;

#[HandledBy(RecordFinishedTaskHandler::class)]
#[Operation('record_finished_task', ResourceAreaType::JournalWork, AccessType::Edit)]
#[Authorize(TaskWatchPolicy::class, TaskWatchAbility::Record)]
final readonly class RecordFinishedTask extends TaskWatchRecord {}
