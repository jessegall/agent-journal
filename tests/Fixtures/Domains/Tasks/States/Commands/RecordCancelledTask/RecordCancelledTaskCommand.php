<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\RecordCancelledTask;

use App\Enums\AccessType;
use App\Attributes\Authorize;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;
use Tests\Fixtures\Domains\Tasks\States\Commands\Support\TaskWatchRecord;

#[Authorize(TaskWatchPolicy::class, AccessType::Edit)]
final readonly class RecordCancelledTaskCommand extends TaskWatchRecord {}
