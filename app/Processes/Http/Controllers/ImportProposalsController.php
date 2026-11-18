<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ImportProposalsRequest;
use App\Processes\Commands\ImportRuleProposals;
use App\Processes\Values\ProposalReceipt;
use Illuminate\Http\JsonResponse;

/**
 * Imports a repository declaration file as proposals, never as active rules.
 */
final readonly class ImportProposalsController
{
    public function __invoke(ImportProposalsRequest $request, CommandBus $commands): JsonResponse
    {
        $imported = $commands->run(new ImportRuleProposals($request->declarations()));

        return new JsonResponse(array_map(fn (ProposalReceipt $receipt) => $receipt->toArray(), $imported));
    }
}
