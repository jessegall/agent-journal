<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Enums\CommandEffectType;
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
     * @param  array<string, list<string|object>>  $rules  each ruled property's Laravel rules, the type rule first
     */
    public function __construct(
        public string $handler,
        public string $owner,
        public bool $exported,
        public bool $repeatableRead,
        public CommandEffectType $effect,
        public bool $requiresRequestKey,
        public bool $actorScopedReceipt,
        public ReceiptRetention $retention,
        public array $middleware,
        public array $rules,
        public CommandAuthorization|null $authorization = null,
        public CommandEntry $entry = CommandEntry::Application,
    ) {}
}
