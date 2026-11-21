<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Contracts\HostCalls;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\CallSignatureInvalid;
use App\Agents\Exceptions\HostCredentialRejected;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Connections\Commands\RecoverProjectBinding;
use App\Connections\Exceptions\BindingUnrecoverable;
use App\Http\Requests\Connections\RecoverBindingRequest;
use Illuminate\Http\JsonResponse;

/**
 * Gives a relay that lost its redemption's reply the identifiers of the binding its nonce made, found by the host its
 * signed call authenticates. A call the host cannot sign rightly and a nonce that is not its own get one answer.
 */
final readonly class RecoverBindingController
{
    public function __invoke(
        RecoverBindingRequest $request,
        HostCalls $calls,
        EntryDispatchers $dispatchers,
    ): JsonResponse {
        try {
            $host = $calls->verify($request, HostProtocolVersion::RemoteProject);
        } catch (HostCredentialRejected|CallSignatureInvalid $refusal) {
            throw BindingUnrecoverable::generic($refusal);
        }

        $recover = new RecoverProjectBinding($host->hostId, $request->installationNonce());
        $redemption = $dispatchers->runAsJournal(CommandEntry::HostControl, 'binding recovery', $recover);

        return new JsonResponse([
            'hostId' => $redemption->hostId,
            'projectId' => $redemption->projectId,
            'bindingId' => $redemption->bindingId,
            'mainAgentId' => $redemption->mainAgentId,
            'protocol' => HostProtocolVersion::RemoteProject->value,
        ], JsonResponse::HTTP_OK, ['Cache-Control' => 'no-store, private']);
    }
}
