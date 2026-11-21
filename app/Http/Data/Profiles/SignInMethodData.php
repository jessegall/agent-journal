<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Profiles\Enums\SignInMethod;
use App\Programs\Enums\HookProgram;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One sign-in method a program declares here, as the add-account wizard offers it: whether the owner gives a key or
 * token, the sentence about how it is paid for or how long it lasts, and its card: title, description, the short
 * billing label and, for a key or token, where to get the secret.
 */
#[TypeScript]
final class SignInMethodData extends Data
{
    public function __construct(
        public readonly SignInMethod $method,
        public readonly bool $isSecret,
        public readonly string $billingNote,
        public readonly string $title,
        public readonly string $description,
        public readonly string $billingLabel,
        public readonly string|Optional $secretSource = new Optional(),
    ) {}

    public static function fromMethod(HookProgram $program, SignInMethod $method): self
    {
        return SignInMethodData::from([
            'method' => $method,
            'isSecret' => $method->isSecret(),
            'billingNote' => $method->billingNote(),
            'title' => $method->title($program),
            'description' => $method->description($program),
            'billingLabel' => $method->billingLabel(),
            'secretSource' => $method->secretSource($program) ?? Optional::create(),
        ]);
    }
}
