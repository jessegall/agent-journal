<?php

declare(strict_types=1);

namespace App\Communication\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\MessageAbility;
use App\Communication\Models\Message;
use BackedEnum;

/**
 * Who may act on a message: anyone granted may send one or ask for an answer, and only the actor the current round
 * is addressed to answers or dismisses it.
 */
final readonly class MessagePolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     *
     * @throws ActorNotAllowed
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void
    {
        if (! $ability instanceof MessageAbility || ! $ability->needsTheAddressee()) {
            return;
        }

        if (! $subject instanceof Message || ! $subject->isByActor(ActorIdentity::of($actor))) {
            throw ActorNotAllowed::to($ability, 'message');
        }
    }
}
