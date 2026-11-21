<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\HostProtocolMismatch;
use App\Agents\Support\ServerOrigin;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Http\Requests\Connections\RedeemProjectInvitationRequest;
use Illuminate\Http\JsonResponse;

/**
 * Redeems an install line for a relay through the host control entry, and answers what it made with the protocol and
 * the canonical origin the relay talks to from now on.
 */
final readonly class RedeemProjectInvitationController
{
    public function __invoke(
        RedeemProjectInvitationRequest $request,
        EntryDispatchers $dispatchers,
        ServerOrigin $origin,
    ): JsonResponse {
        $protocol = HostProtocolVersion::RemoteProject->value;

        if ($request->protocol() !== $protocol) {
            throw HostProtocolMismatch::speaks((string) $request->protocol(), $protocol);
        }

        $redemption = $dispatchers->runAsJournal(CommandEntry::HostControl, 'project redemption', $request->command());

        return new JsonResponse([
            'hostId' => $redemption->hostId,
            'projectId' => $redemption->projectId,
            'bindingId' => $redemption->bindingId,
            'mainAgentId' => $redemption->mainAgentId,
            'projectLabel' => $redemption->projectLabel,
            'protocol' => $protocol,
            'canonicalOrigin' => $origin->canonical(),
        ], JsonResponse::HTTP_CREATED, ['Cache-Control' => 'no-store, private']);
    }
}
