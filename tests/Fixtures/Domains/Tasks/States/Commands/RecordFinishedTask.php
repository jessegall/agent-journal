<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use Tests\Fixtures\Domains\Tasks\States\Handlers\RecordFinishedTaskHandler;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;

#[HandledBy(RecordFinishedTaskHandler::class)]
#[Authorize(TaskWatchPolicy::class, AccessType::Edit)]
final readonly class RecordFinishedTask extends TaskWatchRecord {}
