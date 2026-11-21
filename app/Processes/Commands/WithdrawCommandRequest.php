<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;

/**
 * The actor who opened a command request, or a user, withdraws it; it stays readable as history.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class WithdrawCommandRequest extends Command
{
    public function __construct(public string $requestId) {}
}
