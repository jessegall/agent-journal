<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\SignInState;
use App\Models\Accounts\SignInAttempt;
use App\Values\SignInChallenge;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Contracts\Encryption\Encrypter;

/**
 * The short-lived, encrypted exchange between the host running a sign-in and the user approving it: the challenge
 * the driver printed, and the code the user typed back. Each lives only until the attempt's deadline, and a typed
 * code is handed to the host once.
 */
final readonly class SignInChallenges
{
    public function __construct(private Repository $cache, private Encrypter $encrypter) {}

    public function publish(string $attemptId, SignInChallenge $challenge, CarbonImmutable $until): void
    {
        $challengeFields = ['address' => $challenge->address, 'code' => $challenge->code];
        $this->cache->put(self::challengeKey($attemptId), $this->encrypter->encrypt($challengeFields), $until);
    }

    public function challengeOf(string $attemptId): SignInChallenge|null
    {
        $stored = $this->cache->get(self::challengeKey($attemptId));

        if (! is_string($stored)) {
            return null;
        }

        $challengeFields = $this->encrypter->decrypt($stored);

        return new SignInChallenge((string) $challengeFields['address'], $challengeFields['code'] ?? null);
    }

    /**
     * Stages the user's answer under its request key until the deadline; the host is handed it only once the attempt's
     * acceptance of that key is committed.
     */
    public function typeCode(string $attemptId, string $submissionKey, string $code, CarbonImmutable $until): void
    {
        $answer = ['key' => $submissionKey, 'code' => $code];
        $this->cache->put(self::codeKey($attemptId), $this->encrypter->encrypt($answer), $until);
    }

    /**
     * The answer the attempt accepted, handed over once; an answer whose acceptance never committed stays where it is
     * and is never handed out.
     */
    public function takeCode(SignInAttempt $attempt): string|null
    {
        $stored = $this->cache->get(self::codeKey($attempt->id));

        if (! is_string($stored)) {
            return null;
        }

        $answer = $this->encrypter->decrypt($stored);

        if ($attempt->state !== SignInState::Checking || ! $attempt->tookAnswer((string) $answer['key'])) {
            return null;
        }

        return $this->cache->pull(self::codeKey($attempt->id)) === null ? null : (string) $answer['code'];
    }

    /**
     * Forgets the attempt's challenge and any code the user typed for it, once the attempt has ended.
     */
    public function forget(string $attemptId): void
    {
        $this->cache->forget(self::challengeKey($attemptId));
        $this->cache->forget(self::codeKey($attemptId));
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
