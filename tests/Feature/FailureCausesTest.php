<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Contracts\Refusals\RefusalMapper;
use App\Enums\Engine\RefusalCode;
use App\Mcp\Data\JsonRpcMessageData;
use App\Mcp\Support\Frame;
use App\Mcp\Support\LoggedMcpCall;
use App\Mcp\Support\RelayFrames;
use App\Mcp\Support\ResultBudget;
use App\Support\AgentCallReply;
use App\Support\AgentContext;
use App\Support\SignedCall;
use App\Values\MappedRefusal;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Laravel\Mcp\Response;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Tests\Support\RecordingLogger;
use Tests\TestCase;
use Throwable;

/**
 * A failure that is turned into a refusal, a retry or a null still says why it failed: its class and message reach the
 * log or the relay's diagnostics, and the failure itself travels as the cause.
 */
final class FailureCausesTest extends TestCase
{
    public function test_an_mcp_call_that_fails_logs_the_class_and_message_of_its_cause(): void
    {
        $logger = new RecordingLogger();
        $mapper = new class implements RefusalMapper
        {
            public function refusal(Throwable $failure, string $subject, string $correlationId): MappedRefusal
            {
                return new MappedRefusal(RefusalCode::InvalidInput, 'Refused.');
            }
        };
        $call = new LoggedMcpCall(
            new AgentContext('agent', 'session', new SignedCall('call-1', CarbonImmutable::now(), 'digest'), null),
            $mapper,
            new ResultBudget(),
            $logger,
        );
        $cause = new RuntimeException('the reader broke');

        $call->answerResource('journal://v1/x', fn (): Response => throw $cause);

        $context = $logger->contextOf('mcp.resource');
        $this->assertSame(RuntimeException::class, $context['failure']);
        $this->assertSame($cause->getMessage(), $context['message']);
        $this->assertSame($cause, $context['exception']);
    }

    public function test_a_relay_answer_that_is_not_a_json_rpc_reply_says_why_in_its_diagnostics(): void
    {
        $errors = fopen('php://memory', 'w+');
        $relay = new RelayFrames(fopen('php://memory', 'r'), fopen('php://memory', 'w+'), $errors);
        $frame = new Frame(
            '{"jsonrpc":"2.0","id":1,"method":"ping"}',
            new JsonRpcMessageData('2.0', 1, 'ping'),
            CarbonImmutable::now(),
        );

        $relay->answer($frame, new AgentCallReply(500, [], 'not json'));

        rewind($errors);
        $this->assertStringContainsString('JsonException', (string) stream_get_contents($errors));
    }

    public function test_the_global_handler_reports_every_failure_with_its_class_and_message(): void
    {
        $logger = new RecordingLogger();
        $this->app->instance(LoggerInterface::class, $logger);

        $failure = new RuntimeException('something broke');
        $this->app->make(ExceptionHandler::class)->report($failure);

        $context = $logger->lines[0]['context'];
        $this->assertSame(RuntimeException::class, $context['failure']);
        $this->assertSame($failure->getMessage(), $context['message']);
    }
}
