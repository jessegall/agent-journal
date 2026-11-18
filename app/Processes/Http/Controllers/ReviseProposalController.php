<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\DeclarationRequest;
use App\Processes\Commands\ReviseRuleProposal;
use App\Processes\Declarations\RuleDeclarations;
use Illuminate\Http\JsonResponse;

/**
 * The author adds a revision to their proposal on top of the revision they read.
 */
final readonly class ReviseProposalController
{
    public function __construct(private RuleDeclarations $declarations) {}

    public function __invoke(DeclarationRequest $request, string $proposal, CommandBus $commands): JsonResponse
    {
        $declared = $this->declarations->readOne($request->declaration());
        $command = new ReviseRuleProposal($proposal, $request->expectedRevision(), $declared->proposed);

        return new JsonResponse($commands->run($command)->toArray());
    }
}
