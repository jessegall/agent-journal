<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Profiles\Enums\SignInMethod;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One sign-in method a program declares here, as the sign-in form offers it: whether the owner gives a key or token,
 * and the sentence about how it is paid for or how long it lasts.
 */
#[TypeScript]
final class SignInMethodData extends Data
{
    public function __construct(
        public readonly SignInMethod $method,
        public readonly bool $isSecret,
        public readonly string $billingNote,
    ) {}

    public static function fromMethod(SignInMethod $method): self
    {
        return new self($method, $method->isSecret(), $method->billingNote());
    }
}
