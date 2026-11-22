<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ClaimStart\ClaimStartCommand;
use App\Agents\Values\ChildCheckout;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\StartReportRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Hands the host the pending start of a session, once; a start taken, cancelled or of an ended session is gone.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class ClaimStartController
{
    public function __invoke(StartReportRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $claimed = $commands->run(new ClaimStartCommand($host->hostId, $request->sessionId()));

        return $claimed === null
            ? new JsonResponse(['message' => 'This start is no longer waiting for a host.'], Response::HTTP_GONE)
            : new JsonResponse([
                'start_key' => $claimed->startKey,
                'session_id' => $claimed->sessionId,
                'directory' => $claimed->directory,
                'generation' => $claimed->generation,
                'sign_in_method' => $claimed->signInMethod,
                'recipe' => $claimed->recipe,
                'conversation_target' => $claimed->conversationTarget,
                'conversation_required' => $claimed->conversationRequired,
                // A connected project's child works in its own worktree, prepared for this claim; none otherwise.
                'child_checkout' => array_map(fn (ChildCheckout $checkout) => [
                    'claim' => $checkout->claimId,
                    'generation' => $checkout->generation,
                    'writes' => $checkout->writes,
                    'base' => $checkout->baseOid,
                ], $claimed->childCheckouts)[0] ?? null,
            ]);
    }
}
