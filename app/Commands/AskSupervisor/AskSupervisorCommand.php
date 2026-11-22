<?php

declare(strict_types=1);

namespace App\Commands\AskSupervisor;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Enums\AccessType;
use App\Enums\CoreAskType;
use App\Policies\AskPolicy;
use App\Support\Command;
use App\Values\AskReference;
use App\Values\AskTypeKey;

/**
 * @extends Command<AskReference>
 */
#[RepeatableRead]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class AskSupervisorCommand extends Command
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
}
