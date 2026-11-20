<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\VerifyRestoredOutputHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * After an operator restored files to the output disk, a user checks a run's parts against their original chunk
 * checksums; only parts whose every byte matches become complete again.
 *
 * @extends Command<array<string, string>>
 */
#[HandledBy(VerifyRestoredOutputHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
#[Operation('verify_restored_output', ResourceAreaType::Workspace, AccessType::Test)]
final readonly class VerifyRestoredOutput extends Command implements HasAuthorizationSubject
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
