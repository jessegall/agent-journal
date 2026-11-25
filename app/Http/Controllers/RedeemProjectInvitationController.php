<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Accounts\CommandEntry;
use App\Http\Requests\Connections\RedeemProjectInvitationRequest;
use App\Support\EntryDispatchers;
use App\Support\ServerOrigin;
use Illuminate\Http\JsonResponse;

/**
 * Redeems an install line for a relay through the host control entry, and answers what it made with the canonical
 * origin the relay talks to from now on.
 */
final readonly class RedeemProjectInvitationController
{
    public function __invoke(
        RedeemProjectInvitationRequest $request,
        EntryDispatchers $dispatchers,
        ServerOrigin $origin,
    ): JsonResponse {
        $redemption = $dispatchers->runAsJournal(CommandEntry::HostControl, 'project redemption', $request->command());

        return new JsonResponse([
            'hostId' => $redemption->hostId,
            'projectId' => $redemption->projectId,
            'bindingId' => $redemption->bindingId,
            'mainAgentId' => $redemption->mainAgentId,
            'projectLabel' => $redemption->projectLabel,
            'canonicalOrigin' => $origin->canonical(),
        ], JsonResponse::HTTP_CREATED, ['Cache-Control' => 'no-store, private']);
    }
}
