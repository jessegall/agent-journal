<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing;

use App\Http\Responses\Sharing\SharedPageResponses;
use App\Support\ProbeChallenges;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

/**
 * Answers a gateway's health probe on the share listener: the challenge itself, once, when it was issued.
 */
final readonly class ProbeChallengeController
{
    public function __invoke(
        string $challenge,
        ProbeChallenges $challenges,
        SharedPageResponses $responses,
    ): BaseResponse {
        if (! $challenges->answer($challenge)) {
            return $responses->refused(404);
        }

        return new Response($challenge, 200, ['Content-Type' => 'text/plain']);
    }
}
