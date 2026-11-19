<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use Domain\Documents\Contracts\EditorContext;
use Illuminate\Container\Attributes\Scoped;

/**
 * The editor of this request: its actor, and for an agent the session of its signed call; a user has no session.
 */
#[Scoped]
final readonly class RequestEditor implements EditorContext
{
    public function __construct(private CurrentActor $actors) {}

    public function editor(): ActorIdentity
    {
        return ActorIdentity::of($this->actors->actor());
    }
}
