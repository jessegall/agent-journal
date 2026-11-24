<?php

declare(strict_types=1);

namespace App\Commands\Messages\DeclineChatQuestion;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Declines a waiting chat question with a reason; an agent spends the turn kept for it.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class DeclineChatQuestionCommand extends Command
{
    public function __construct(
        public string $questionId,
        #[Required]
        public string $reason,
        public string|null $claimToken = null,
    ) {}
}
