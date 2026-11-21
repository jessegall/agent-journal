<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInReceiptStatus;
use App\Profiles\Enums\SignInState;
use App\Profiles\Enums\SignInType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The receipt of one sign-in start under the owner's request key: the attempt it started or rejoined, whether it adds
 * an account or renews one, the method it actually uses and its state now, also after it ended; or why it has none.
 */
#[TypeScript]
final class SignInReceiptData extends Data
{
    public function __construct(
        public readonly SignInReceiptStatus $status,
        public readonly string|null $attemptId,
        public readonly SignInType|null $type,
        public readonly SignInMethod|null $method,
        public readonly SignInState|null $state,
        public readonly string|null $refusal,
    ) {}

    public static function without(SignInReceiptStatus $status, string|null $refusal = null): self
    {
        return new self($status, null, null, null, null, $refusal);
    }
}
