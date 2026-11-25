<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Data\Profiles\SignInReceiptInput;
use App\Support\SignInReceipts;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final readonly class SignInReceiptController
{
    /**
     * What became of the owner's own sign-in start under a request key; no cache keeps the answer.
     */
    public function __invoke(SignInReceiptInput $input, Request $request, SignInReceipts $receipts): Response
    {
        $response = $receipts->of($input)->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store');

        return $response;
    }
}
