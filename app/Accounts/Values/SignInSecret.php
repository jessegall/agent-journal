<?php

declare(strict_types=1);

namespace App\Accounts\Values;

use App\Accounts\Enums\SignInMethod;
use App\Exceptions\SignInCodeInvalid;
use App\Values\SignInCode;

/**
 * A key or token the owner gives for a secret sign-in method: trimmed, 1 to 4096 bytes, one line with no control
 * character. It travels to the host like a typed code and is never saved in any row.
 */
final readonly class SignInSecret
{
    private const int LIMIT = 4096;

    private function __construct(public string $secret) {}

    /**
     * @throws SignInCodeInvalid
     */
    public static function from(string $text): self
    {
        return new self(SignInCode::oneLine($text, 'key or token', self::LIMIT));
    }

    /**
     * A keyed fingerprint of the secret for its driver and method, so the same key is known again without keeping it.
     */
    public function fingerprintFor(string $driver, SignInMethod $method, string $key): string
    {
        return hash_hmac('sha256', "{$driver}\n{$method->value}\n{$this->secret}", $key);
    }
}
