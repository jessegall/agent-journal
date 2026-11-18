<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\DeclarationRequest;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Declarations\RuleDeclarations;
use Illuminate\Http\JsonResponse;

/**
 * Proposes a declaration for a command request, read into typed values first; a broken field answers 422.
 */
final readonly class ProposeRuleController
{
    public function __construct(private RuleDeclarations $declarations) {}

    public function __invoke(DeclarationRequest $request, string $commandRequest, CommandBus $commands): JsonResponse
    {
        $declared = $this->declarations->readOne($request->declaration());
        $command = new ProposeCommandRule($commandRequest, $declared->requestId, $declared->proposed);

        return new JsonResponse($commands->run($command)->toArray());
    }
}
