<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskCancelled;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use Tests\Fixtures\Domains\Tasks\States\Commands\Support\TaskWatchRecord;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;

#[Authorize(TaskWatchPolicy::class, AccessType::Edit)]
final readonly class RecordTaskCancelledCommand extends TaskWatchRecord {}
