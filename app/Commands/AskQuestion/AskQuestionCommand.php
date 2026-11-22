<?php

declare(strict_types=1);

namespace App\Commands\AskQuestion;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
use App\Support\RecordIdentity;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class AskQuestionCommand extends Command
{
    public function __construct(
        #[Required]
        public string $body,
        public RecordIdentity|null $relatedRecord = null,
    ) {}
}
