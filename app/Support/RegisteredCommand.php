<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\Authorize;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Reviews\CommandEffectType;

/**
 * One registered command as the bus runs it: its handler, owner, whether it is exported, its isolation, the actor
 * type it requires, whether the engine may run it, whether it runs only under a request key, how long its receipt
 * is kept, and its ordered module middleware.
 */
final readonly class RegisteredCommand
{
    /**
     * @param  Authorize|null  $authorize  the application command's declaration; null for a trusted command
     * @param  class-string  $handler
     * @param  list<RegisteredMiddleware>  $middleware
     * @param  array<string, list<string|object>>  $rules  each ruled property's Laravel rules, the type rule first
     */
    public function __construct(
        public string $handler,
        public string $owner,
        public bool $isExported,
        public bool $isRepeatableRead,
        public CommandEffectType $effect,
        public bool $requiresRequestKey,
        public bool $isActorScopedReceipt,
        public ReceiptRetention $retention,
        public array $middleware,
        public array $rules,
        public Authorize|null $authorize = null,
        public CommandEntry $entry = CommandEntry::Application,
    ) {}
}
