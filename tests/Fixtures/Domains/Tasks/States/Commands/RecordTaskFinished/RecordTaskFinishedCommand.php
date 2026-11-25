<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskFinished;

use App\Enums\Agents\AccessType;
use App\Attributes\Commands\Authorize;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;
use Tests\Fixtures\Domains\Tasks\States\Commands\Support\TaskWatchRecord;

#[Authorize(TaskWatchPolicy::class, AccessType::Edit)]
final readonly class RecordTaskFinishedCommand extends TaskWatchRecord {}
