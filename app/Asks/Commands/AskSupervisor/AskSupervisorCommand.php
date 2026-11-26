<?php

declare(strict_types=1);

namespace App\Asks\Commands\AskSupervisor;

use App\Agents\Enums\AccessType;
use App\Asks\Enums\CoreAskType;
use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
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
