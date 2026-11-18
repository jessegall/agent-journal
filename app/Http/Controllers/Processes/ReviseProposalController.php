<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

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
    public function __construct(private RuleDeclarations $declarations, private CommandBus $commands) {}

    public function __invoke(DeclarationRequest $request, string $proposal): JsonResponse
    {
        $declared = $this->declarations->readOne($request->declaration());
        $command = new ReviseRuleProposal($proposal, $request->expectedRevision(), $declared->proposed);

        return new JsonResponse($this->commands->run($command)->toArray());
    }
}
