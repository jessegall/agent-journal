<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Bus\Contracts\Refusals\RefusalMapper;
use App\Mcp\Contracts\McpCall as McpCallContract;
use App\Mcp\Data\ToolResult;
use App\Support\AgentContext;
use Closure;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * One MCP call of the signed agent: it runs the tool's or resource's answer, turns a failure into a refusal and logs
 * one line with who called, how long it took and its outcome, never the arguments or the body; a failure also names
 * its class and message and carries itself as the cause.
 */
final readonly class McpCall implements McpCallContract
{
    private const string OUTCOME_OK = 'ok';

    public function __construct(
        private AgentContext $agent,
        private RefusalMapper $refusals,
        private ResultBudget $budget,
        private LoggerInterface $logger,
    ) {}

    /**
     * @param  Closure(): ToolResult  $answer
     */
    public function answerTool(string $tool, Closure $answer): ResponseFactory
    {
        return $this->answer(
            'tool',
            $tool,
            fn (): ResponseFactory => $this->budget->fit($answer()),
            fn (Refusal $refusal): ResponseFactory => $refusal->toolResponse(),
        );
    }

    /**
     * @param  Closure(): Response  $content
     */
    public function answerResource(string $uri, Closure $content): Response
    {
        return $this->answer(
            'resource',
            $uri,
            $content,
            fn (Refusal $refusal): Response => $refusal->resourceResponse(),
        );
    }

    /**
     * @template T
     *
     * @param  Closure(): T  $answer
     * @param  Closure(Refusal): T  $refused
     * @return T
     */
    private function answer(string $type, string $subject, Closure $answer, Closure $refused): mixed
    {
        $started = hrtime(true);
        $cause = [];

        try {
            $response = $answer();
            $outcome = self::OUTCOME_OK;
        } catch (Throwable $failure) {
            $refusal = Refusal::of($this->refusals->refusal($failure, $subject, $this->agent->call->callId));
            $response = $refused($refusal);
            $outcome = $refusal->code->value;
            $cause = ['failure' => $failure::class, 'message' => $failure->getMessage(), 'exception' => $failure];
        }

        $this->logger->info("mcp.{$type}", [
            $type => $subject,
            'agent_id' => $this->agent->agentId,
            'session_id' => $this->agent->sessionId,
            'correlation_id' => $this->agent->call->callId,
            'duration_ms' => intdiv(hrtime(true) - $started, 1_000_000),
            'outcome' => $outcome,
            ...$cause,
        ]);

        return $response;
    }
}
