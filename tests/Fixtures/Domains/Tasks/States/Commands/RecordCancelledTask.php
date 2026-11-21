<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;

#[Authorize(TaskWatchPolicy::class, AccessType::Edit)]
final readonly class RecordCancelledTask extends TaskWatchRecord {}
