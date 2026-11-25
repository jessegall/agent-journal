<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Search\SearchSurface;
use App\Support\ActorReference;

/**
 * Whom a search belongs to: the authenticated session, the actor, the environment, the tool and the surface. A
 * handle opens only for the same owner on every replay.
 */
final readonly class SearchOwner
{
    public function __construct(
        public string $sessionId,
        public ActorReference $actor,
        public string $environmentId,
        public string $tool,
        public SearchSurface $surface,
    ) {}

    /**
     * Every part of the binding in one string, which the handle's signature covers.
     */
    public function binding(): string
    {
        return implode("\n", [
            $this->sessionId,
            $this->actor->type,
            $this->actor->id,
            $this->environmentId,
            $this->tool,
            $this->surface->value,
        ]);
    }

    /**
     * The principal and environment the active-search limit counts per.
     */
    public function principal(): string
    {
        return hash('sha256', implode("\n", [
            $this->actor->type,
            $this->actor->id,
            $this->environmentId,
        ]));
    }
}
