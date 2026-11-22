<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Drivers\Enums\HookDriver;
use App\Profiles\Enums\SignInMethod;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One sign-in method a driver declares here, as the add-account wizard offers it: whether the owner gives a key or
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
        public readonly string|null $secretSource,
    ) {}

    public static function fromMethod(HookDriver $driver, SignInMethod $method): self
    {
        return SignInMethodData::from([
            'method' => $method,
            'isSecret' => $method->isSecret(),
            'billingNote' => $method->billingNote($driver),
            'title' => $method->title($driver),
            'description' => $method->description($driver),
            'billingLabel' => $method->billingLabel(),
            'secretSource' => $method->secretSource($driver),
        ]);
    }
}
