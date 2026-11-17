<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Http;

use App\Domain\Agents\AgentContext;
use App\Domain\Agents\BypassReport;
use App\Domain\Agents\LaunchBypasses;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Takes the bypasses a host uploads after the journal came back and keeps them as facts for the launch.
 */
final readonly class BypassReportController
{
    public function __construct(private LaunchBypasses $bypasses) {}

    public function __invoke(Request $request, AgentContext $context): Response
    {
        $this->bypasses->record($context->sessionId, BypassReport::from($request->json()->all()));

        return new Response('', Response::HTTP_NO_CONTENT);
    }
}
