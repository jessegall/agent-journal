<?php

declare(strict_types=1);

namespace App\Data\Accounts;

use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInReceiptStatus;
use App\Enums\Accounts\SignInStatus;
use App\Enums\Accounts\SignInType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The receipt of one sign-in start under the owner's request key: the attempt it started or rejoined, whether it adds
 * an account or renews one, the account it made, renewed or matched when the reader may read it, the method it
 * actually uses and its state now, also after it ended; or why it has none.
 */
#[TypeScript]
final class SignInReceiptData extends Data
{
    public function __construct(
        public readonly SignInReceiptStatus $status,
        public readonly string|null $attemptId,
        public readonly SignInType|null $type,
        public readonly string|null $resultAccountId,
        public readonly SignInMethod|null $method,
        public readonly SignInStatus|null $signInStatus,
        public readonly string|null $refusal,
    ) {}

    public static function without(SignInReceiptStatus $status, string|null $refusal = null): self
    {
        return new self($status, null, null, null, null, null, $refusal);
    }
}
