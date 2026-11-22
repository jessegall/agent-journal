<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Profiles\SignInReceiptRequest;
use App\Support\SignInReceipts;
use Symfony\Component\HttpFoundation\Response;

final readonly class SignInReceiptController
{
    /**
     * What became of the owner's own sign-in start under a request key; no cache keeps the answer.
     */
    public function __invoke(SignInReceiptRequest $request, SignInReceipts $receipts): Response
    {
        $response = $receipts->of($request)->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store');

        return $response;
    }
}
