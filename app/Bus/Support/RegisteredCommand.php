<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Enums\ActorType;
use App\Bus\Enums\CommandEntry;

/**
 * One registered command as the bus runs it: its handler, owner, whether it is exported, its isolation, the actor
 * type it requires, whether the engine may run it, whether it runs only under a request key, how long its receipt
 * is kept, and its ordered module middleware.
 */
final readonly class RegisteredCommand
{
    /**
     * @param  CommandAuthorization|null  $authorization  null while the command declares no Authorize yet
     * @param  class-string  $handler
     * @param  list<RegisteredMiddleware>  $middleware
     */
    public function __construct(
        public string $handler,
        public string $owner,
        public bool $exported,
        public bool $repeatableRead,
        public ActorType|null $actor,
        public bool $requiresRequestKey,
        public ReceiptRetention $retention,
        public array $middleware,
        public CommandAuthorization|null $authorization = null,
        public CommandEntry $entry = CommandEntry::Application,
    ) {}
}
