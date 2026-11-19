<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Models\SignInAttempt;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An unfinished new account's sign-in whose folder still waits for its cleanup: no account row exists for it, so it
 * is shown and retried by the attempt itself. Only a safe reason and the time it was last tried are shown.
 */
#[TypeScript]
final class PendingAttemptCleanupData extends Data
{
    public function __construct(
        public readonly string $attemptId,
        public readonly string $program,
        public readonly string|null $label,
        public readonly CleanupProblem|null $problem,
        public readonly string|null $lastTriedAt,
        public readonly bool $awaitsRetry,
    ) {}

    public static function fromAttempt(SignInAttempt $attempt): self
    {
        return new self(
            $attempt->id,
            $attempt->program,
            $attempt->label,
            $attempt->cleanup_problem,
            $attempt->updated_at?->toIso8601String(),
            $attempt->awaitsCleanupRetry(),
        );
    }
}
