<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Support\AgentContext;
use App\Connections\Support\ProjectCommands;
use App\Connections\Values\CommandFrame;
use App\Http\Requests\Connections\ProjectCommandRequest;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Streams a connected machine's journal verb as one JSON frame per line, in sequence: its output as it is written,
 * then one exit frame with its code.
 */
final readonly class ProjectCommandController
{
    public function __invoke(ProjectCommandRequest $request, AgentContext $agent, ProjectCommands $commands): StreamedResponse
    {
        $commands->assertServed($request, $agent->agentId);

        return new StreamedResponse(function () use ($request, $agent, $commands): void {
            $commands->run($request, $agent->agentId, function (CommandFrame $frame): void {
                echo json_encode($frame->toArray(), JSON_THROW_ON_ERROR)."\n";
                flush();
            });
        }, StreamedResponse::HTTP_OK, ['Content-Type' => 'application/x-ndjson', 'Cache-Control' => 'no-store']);
    }
}
