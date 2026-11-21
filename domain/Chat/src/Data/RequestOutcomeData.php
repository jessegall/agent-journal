<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Domain\Chat\Enums\RequestOutcome;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What became of a request: its outcome, the message it made when confirmed, and the refusal's code and message
 * when refused.
 */
#[TypeScript]
final class RequestOutcomeData extends Data
{
    public function __construct(
        public readonly RequestOutcome $outcome,
        public readonly string|Optional $messageId = new Optional(),
        public readonly string|Optional $code = new Optional(),
        public readonly string|Optional $message = new Optional(),
    ) {}

    public static function of(RequestOutcome $outcome): self
    {
        return self::from(['outcome' => $outcome]);
    }
}
