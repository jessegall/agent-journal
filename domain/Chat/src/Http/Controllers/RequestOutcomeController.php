<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use Domain\Chat\Data\RequestOutcomeInput;
use Domain\Chat\Support\RequestOutcomes;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final readonly class RequestOutcomeController
{
    /**
     * What became of the caller's own send or reply under a request key; no cache keeps the answer.
     */
    public function __invoke(RequestOutcomeInput $input, Request $request, RequestOutcomes $outcomes): Response
    {
        $response = $outcomes->of($input)->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store');

        return $response;
    }
}
