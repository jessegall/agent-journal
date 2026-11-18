<?php

declare(strict_types=1);

namespace App\Core\Bus\Support;

use App\Core\Actors\Enums\ActorType;

/**
 * One registered command as the bus runs it: its handler, owner, whether it is exported, its isolation, the actor
 * type it requires and its ordered module middleware.
 */
final readonly class RegisteredCommand
{
    /**
     * @param  class-string  $handler
     * @param  list<RegisteredMiddleware>  $middleware
     */
    public function __construct(
        public string $handler,
        public string $owner,
        public bool $exported,
        public bool $repeatableRead,
        public ActorType|null $actor,
        public array $middleware,
    ) {}
}
