<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Values\SignInChallenge;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Contracts\Encryption\Encrypter;

/**
 * The short-lived, encrypted exchange between the host running a sign-in and the person approving it: the challenge
 * the program printed, and the code the person typed back. Each lives only until the attempt's deadline, and a typed
 * code is handed to the host once.
 */
final readonly class SignInChallenges
{
    public function __construct(private Repository $cache, private Encrypter $encrypter) {}

    public function publish(string $attemptId, SignInChallenge $challenge, CarbonImmutable $until): void
    {
        $payload = ['address' => $challenge->address, 'code' => $challenge->code];
        $this->cache->put(self::challengeKey($attemptId), $this->encrypter->encrypt($payload), $until);
    }

    public function challengeOf(string $attemptId): SignInChallenge|null
    {
        $stored = $this->cache->get(self::challengeKey($attemptId));

        if (! is_string($stored)) {
            return null;
        }

        $payload = $this->encrypter->decrypt($stored);

        return new SignInChallenge((string) $payload['address'], $payload['code'] ?? null);
    }

    public function typeCode(string $attemptId, string $code, CarbonImmutable $until): void
    {
        $this->cache->put(self::codeKey($attemptId), $this->encrypter->encrypt($code), $until);
    }

    /**
     * The code the person typed, handed over once.
     */
    public function takeCode(string $attemptId): string|null
    {
        $stored = $this->cache->pull(self::codeKey($attemptId));

        return is_string($stored) ? (string) $this->encrypter->decrypt($stored) : null;
    }

    private static function challengeKey(string $attemptId): string
    {
        return "accounts:sign-in:{$attemptId}:challenge";
    }

    private static function codeKey(string $attemptId): string
    {
        return "accounts:sign-in:{$attemptId}:code";
    }
}
