<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * Why a provider refused a sign-in's proof, from a bounded set: the program's own words never reach the attempt, only
 * the plain reason they match, and words that match none give the generic failure.
 */
enum SignInRefusal: string
{
    case RejectedCredential = 'rejected_credential';
    case NoCredit = 'no_credit';
    case RateLimited = 'rate_limited';
    case Unreachable = 'unreachable';
    case Unknown = 'unknown';

    /**
     * The reason the provider's words match, or the generic failure when they match none.
     */
    public static function fromProvider(string|null $words): self
    {
        foreach ([self::RejectedCredential, self::NoCredit, self::RateLimited, self::Unreachable] as $refusal) {
            if ($words !== null && preg_match($refusal->pattern(), $words) === 1) {
                return $refusal;
            }
        }

        return self::Unknown;
    }

    public function text(): string
    {
        return match ($this) {
            self::RejectedCredential => 'The provider did not accept the key or login. Check it and try again.',
            self::NoCredit => 'The provider refused it because the account has no credit or quota left.',
            self::RateLimited => 'The provider is limiting requests. Try again in a few minutes.',
            self::Unreachable => 'The program could not reach the provider.',
            self::Unknown => 'The sign-in did not finish.',
        };
    }

    private function pattern(): string
    {
        return match ($this) {
            self::RejectedCredential => '/invalid.{0,12}(key|token|credential)|unauthori[sz]ed|authentication|\b401\b/i',
            self::NoCredit => '/credit|billing|quota|insufficient/i',
            self::RateLimited => '/rate.?limit|too many requests|\b429\b/i',
            self::Unreachable => '/could not reach|network|timed? ?out|unreachable|econn/i',
            self::Unknown => '/(?!)/',
        };
    }
}
