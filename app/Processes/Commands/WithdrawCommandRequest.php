<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\WithdrawCommandRequestHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * The actor who opened a command request, or a user, withdraws it; it stays readable as history.
 *
 * @extends Command<string>
 */
#[HandledBy(WithdrawCommandRequestHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class WithdrawCommandRequest extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $requestId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
