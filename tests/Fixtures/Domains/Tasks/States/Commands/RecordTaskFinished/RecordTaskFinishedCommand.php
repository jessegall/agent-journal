<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskFinished;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use Tests\Fixtures\Domains\Tasks\States\Commands\Support\TaskWatchRecord;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;

#[Authorize(TaskWatchPolicy::class, AccessType::Edit)]
final readonly class RecordTaskFinishedCommand extends TaskWatchRecord {}
