<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use Tests\Fixtures\Domains\Tasks\States\Handlers\RecordCancelledTaskHandler;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchAbility;

#[HandledBy(RecordCancelledTaskHandler::class)]
#[Authorize(TaskWatchPolicy::class, TaskWatchAbility::Record)]
#[Operation('record_cancelled_task', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class RecordCancelledTask extends TaskWatchRecord {}
