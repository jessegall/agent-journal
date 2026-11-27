<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Attributes\Dispatches;
use App\Bus\JournalCommands;
use App\Exceptions\HostCredentialRejected;
use App\Hosts\Contracts\SignedHostCalls;
use App\Hosts\Exceptions\ApiSignatureInvalid;
use App\Http\Requests\Connections\RecoverBindingRequest;
use App\Projects\Commands\RecoverProjectBinding\RecoverProjectBindingCommand;
use App\Projects\Exceptions\BindingUnrecoverable;
use Illuminate\Http\JsonResponse;

/**
 * Gives a relay that lost its redemption's reply the identifiers of the binding its nonce made, found by the host its
 * signed call authenticates. A call the host cannot sign rightly and a nonce that is not its own get one answer.
 */
final readonly class RecoverBindingController
{
    #[Dispatches(RecoverProjectBindingCommand::class)]
    public function __invoke(
        RecoverBindingRequest $request,
        SignedHostCalls $calls,
        JournalCommands $dispatchers,
    ): JsonResponse {
        try {
            $host = $calls->verifyRelay($request);
        } catch (HostCredentialRejected|ApiSignatureInvalid $refusal) {
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
        ], JsonResponse::HTTP_OK, ['Cache-Control' => 'no-store, private']);
    }
}
