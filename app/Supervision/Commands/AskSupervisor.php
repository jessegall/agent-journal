<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Values\AskTypeKey;
use App\Supervision\Enums\AskAbility;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Handlers\AskSupervisorHandler;
use App\Supervision\Models\Ask;
use App\Supervision\Policies\AskPolicy;
use App\Supervision\Values\AskReference;

/** @extends Command<AskReference> */
#[RepeatableRead]
#[HandledBy(AskSupervisorHandler::class)]
#[Authorize(AskPolicy::class, AskAbility::Work)]
#[Operation('ask_supervisor', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class AskSupervisor extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $body,
        public string $submissionKey,
        public AskTypeKey|null $type = null,
    ) {}

    public function typeKey(): AskTypeKey
    {
        return $this->type ?? CoreAskType::Question->key();
    }

    /** @return class-string<Ask> */
    public function subject(): string
    {
        return Ask::class;
    }
}
