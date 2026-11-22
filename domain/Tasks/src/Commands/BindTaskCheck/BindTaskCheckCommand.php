<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\BindTaskCheck;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Binds a published result receipt to the task check of its process run, once; run by the journal after the receipt
 * committed. A receipt of a process run no check names binds nothing.
 *
 * @extends Command<null>
 */
#[Authorize(TaskPolicy::class, AccessType::Edit)]
final readonly class BindTaskCheckCommand extends Command
{
    public function __construct(public string $receiptId) {}
}
