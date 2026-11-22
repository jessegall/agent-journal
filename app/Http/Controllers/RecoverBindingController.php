<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\RecoverProjectBinding\RecoverProjectBindingCommand;
use App\Contracts\Hosts\HostCalls;
use App\Enums\CommandEntry;
use App\Enums\HostProtocolVersion;
use App\Exceptions\BindingUnrecoverable;
use App\Exceptions\CallSignatureInvalid;
use App\Exceptions\HostCredentialRejected;
use App\Http\Requests\Connections\RecoverBindingRequest;
use App\Support\EntryDispatchers;
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

        $recover = new RecoverProjectBindingCommand($host->hostId, $request->installationNonce());
        $redemption = $dispatchers->runAsJournal(CommandEntry::HostControl, 'binding recovery', $recover);

        return new JsonResponse([
            'hostId' => $redemption->hostId,
            'projectId' => $redemption->projectId,
            'bindingId' => $redemption->bindingId,
            'mainAgentId' => $redemption->mainAgentId,
            'projectLabel' => $redemption->projectLabel,
            'protocol' => HostProtocolVersion::RemoteProject->value,
        ], JsonResponse::HTTP_OK, ['Cache-Control' => 'no-store, private']);
    }
}
