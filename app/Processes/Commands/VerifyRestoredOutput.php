<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\VerifyRestoredOutputHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * After an operator restored files to the output disk, a user checks a run's parts against their original chunk
 * checksums; only parts whose every byte matches become complete again.
 *
 * @implements Command<array<string, string>>
 */
#[HandledBy(VerifyRestoredOutputHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
final readonly class VerifyRestoredOutput implements Command, HasAuthorizationSubject
{
    public function __construct(public string $runId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
