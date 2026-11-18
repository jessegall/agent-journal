<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;

/**
 * Who edits a document: the acting user, or the acting agent with its session.
 */
final readonly class Editor
{
    public function __construct(public Actor $actor, public string|null $sessionId) {}

    public function type(): ActorType
    {
        return $this->actor->actorType();
    }

    public function id(): string
    {
        return $this->actor->actorId();
    }
}
