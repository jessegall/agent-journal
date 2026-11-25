<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks;

use App\Support\AgentContext;
use App\Support\ReportedBypasses;
use App\Values\BypassReport;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Takes the bypasses a host uploads after the journal came back and keeps them as facts for the start.
 */
final readonly class BypassReportController
{
    public function __construct(private ReportedBypasses $bypasses) {}

    public function __invoke(Request $request, AgentContext $context): Response
    {
        $this->bypasses->record($context->sessionId, BypassReport::from($request->json()->all()));

        return new Response('', Response::HTTP_NO_CONTENT);
    }
}
