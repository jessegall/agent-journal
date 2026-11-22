<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Declines a waiting chat question with a reason; an agent spends the turn kept for it.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class DeclineChatQuestion extends Command
{
    public function __construct(
        public string $questionId,
        #[Required]
        public string $reason,
        public string|null $claimToken = null,
    ) {}
}
