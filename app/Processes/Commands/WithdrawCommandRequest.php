<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\WithdrawCommandRequestHandler;

/**
 * The actor who opened a command request, or a user, withdraws it; it stays readable as history.
 *
 * @implements Command<string>
 */
#[HandledBy(WithdrawCommandRequestHandler::class)]
final readonly class WithdrawCommandRequest implements Command
{
    public function __construct(public string $requestId) {}
}
