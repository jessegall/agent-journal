<?php

declare(strict_types=1);

namespace Domain\Questions\Events;

use App\Attributes\Listeners\TransactionListenerConsent;
use App\Support\ActorReference;

/**
 * The target of a question answered it.
 */
#[TransactionListenerConsent]
final readonly class QuestionAnswered implements QuestionEvent
{
    public function __construct(public string $questionId, public string $inboxId, public ActorReference $answeredBy) {}
}
