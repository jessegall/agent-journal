<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\WithdrawCommandRequest;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * The actor who opened a command request, or a user, withdraws it; it stays readable as history.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class WithdrawCommandRequestCommand extends Command
{
    public function __construct(public string $requestId) {}
}
