<?php

declare(strict_types=1);

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\ResponseFactory;
use Laravel\Fortify\Contracts\LogoutResponse;
use Laravel\Fortify\Fortify;

/**
 * Fortify's answer to a sign-out, which also clears the browser's history of the pages the user saw, so going back
 * shows nothing private. The clear is set here, after the sign-out emptied the session.
 */
final readonly class SignOutResponse implements LogoutResponse
{
    public function __construct(private ResponseFactory $inertia) {}

    /**
     * @param  Request  $request
     */
    public function toResponse($request): JsonResponse|RedirectResponse
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        $this->inertia->clearHistory();

        return new RedirectResponse(Fortify::redirects('logout', '/'));
    }
}
