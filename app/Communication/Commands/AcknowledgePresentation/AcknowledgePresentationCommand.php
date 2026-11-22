<?php

declare(strict_types=1);

namespace App\Communication\Commands\AcknowledgePresentation;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * Confirms the pieces of one presentation batch the agent's driver actually showed, by their handles; a body becomes
 * read only once its whole text was confirmed in that driver context. The answer is how many pieces changed.
 *
 * @extends Command<int>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class AcknowledgePresentationCommand extends Command
{
    /**
     * @param  list<string>  $handles
     */
    public function __construct(
        public string $batchId,
        public array $handles,
        public string $contextKey,
    ) {}
}
