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
use App\Processes\Handlers\ApproveSampleHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A project owner approves one evidence sample of a request's exact line under its proposed declaration; the answer
 * is the one-use permit the request's actor runs it with.
 *
 * @extends Command<string>
 */
#[HandledBy(ApproveSampleHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
#[Operation('approve_sample', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ApproveSample extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $commandRequestId,
        public int $expectedRevision,
        public string $commandDigest,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
