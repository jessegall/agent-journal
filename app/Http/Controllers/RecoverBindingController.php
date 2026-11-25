<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Projects\RecoverProjectBinding\RecoverProjectBindingCommand;
use App\Contracts\Hosts\HostCalls;
use App\Enums\Accounts\CommandEntry;
use App\Exceptions\ApiSignatureInvalid;
use App\Exceptions\BindingUnrecoverable;
use App\Exceptions\HostCredentialRejected;
use App\Http\Requests\Connections\RecoverBindingRequest;
use App\Support\JournalCommands;
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
        HostCalls $calls,
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
