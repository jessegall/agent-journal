<?php

declare(strict_types=1);

namespace App\Profiles\Http\Controllers;

use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use Illuminate\Http\JsonResponse;

/**
 * The owner's no-store read of a running sign-in's challenge: the address and code answer this request only, are
 * never part of a page, a saved prop or an event, and are gone once the sign-in ends.
 */
final readonly class SignInChallengeController
{
    public function __invoke(string $attempt, SignInChallenges $challenges): JsonResponse
    {
        $running = SignInAttempt::query()->whereKey($attempt)->first();
        $challenge = $running !== null && $running->isLive() ? $challenges->challengeOf($running->id) : null;

        return new JsonResponse(
            ['address' => $challenge?->address, 'code' => $challenge?->code],
            headers: ['Cache-Control' => 'no-store', 'Pragma' => 'no-cache'],
        );
    }
}
