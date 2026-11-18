<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\AskMessage;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the composer sends: the body exactly as typed (never trimmed, see bootstrap/app.php), the session it was
 * typed for, that session's agent and the draft's submission key.
 */
#[TypeScript]
final class MessageInput extends Data
{
    public function __construct(
        #[Regex('/\S/')] public readonly string $body,
        #[Ulid] public readonly string $session,
        #[Ulid] public readonly string $agent,
        #[Uuid] public readonly string $submissionKey,
    ) {}

    /**
     * The composer's message as the ask it is: to the chosen agent, under the draft's own key, so a resend after a lost
     * answer is the same message.
     */
    public function askMessage(): AskMessage
    {
        return new AskMessage(new ActorIdentity(ActorType::Agent, $this->agent), $this->body, $this->submissionKey);
    }
}
