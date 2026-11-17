<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Home's query: the rules window's filters and the agent session the chat window talks to, as a decimal
 * string.
 */
#[TypeScript]
final class HomeFiltersData extends Data
{
    public function __construct(
        public readonly RuleFiltersData $rules = new RuleFiltersData,
        public readonly string|Optional $session = new Optional,
    ) {}

    public function choosesSession(int $sessionId): bool
    {
        return ! $this->session instanceof Optional && (int) $this->session === $sessionId;
    }
}
