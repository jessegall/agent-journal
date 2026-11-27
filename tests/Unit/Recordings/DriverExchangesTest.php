<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostProcessType;
use App\Recordings\DriverExchanges;
use App\Recordings\Enums\RecordedEventType;
use App\Recordings\RecordedCall;
use App\Recordings\RecordedEvent;
use App\Recordings\RecordingFakes;
use App\Values\HostProcessPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\TestCase;

/**
 * Each driver program's exchange is cut whole out of the host's: its opening, what was typed (a private value only as
 * typed), what it printed, and its exit; a probe is an exchange of its own. The host exchange is built here by hand
 * until phase 7 records one.
 */
final class DriverExchangesTest extends TestCase
{
    public function test_each_programs_exchange_is_cut_whole_out_of_the_host_exchange(): void
    {
        $events = [
            $this->claimed(1, [
                $this->order('open-1', 'open_process', 'terminal', $this->plan(['claude'])),
                $this->order('open-2', 'open_process', 'probe', $this->plan(['claude', '--version'])),
            ]),
            $this->claimed(2, [
                $this->order('keys-1', 'write_keys', 'terminal', [
                    'bytes' => base64_encode("Run: ls.\r"),
                    'if_rows' => null,
                    'if_input_generation' => null,
                    'as_user' => false,
                ]),
                $this->order('private-1', 'write_private', 'terminal', ['submission' => 's-1']),
            ]),
            $this->asked(3, '/host/processes/terminal/output', [
                'frames' => [],
                'chunks' => [['stream' => 'stdout', 'offset' => 0, 'bytes' => base64_encode('README.md')]],
            ]),
            $this->asked(4, '/host/processes/probe/output', [
                'frames' => [],
                'chunks' => [['stream' => 'stdout', 'offset' => 0, 'bytes' => base64_encode('2.1.323')]],
            ]),
            $this->asked(5, '/host/processes/probe', $this->report('probe', 'exited', 0)),
            $this->asked(6, '/host/processes/terminal', $this->report('terminal', 'exited', 3)),
        ];

        $exchanges = new DriverExchanges()->cutFrom($events, new RecordingFakes([]));
        $kept = array_map(fn ($exchange) => [
            $exchange->opening->argv,
            array_map(fn (RecordedEvent $event) => [$event->type, $event->bytes, $event->isSecret], $exchange->events),
            $exchange->exitCode,
        ], $exchanges);

        $this->assertSame(
            [
                'terminal' => [['claude'], [
                    [RecordedEventType::Typed, "Run: ls.\r", false],
                    [RecordedEventType::Typed, '', true],
                    [RecordedEventType::Printed, 'README.md', false],
                ], 3],
                'probe' => [['claude', '--version'], [[RecordedEventType::Printed, '2.1.323', false]], 0],
            ],
            $kept,
        );
    }

    /**
     * The host's claim at the moment, answered with the orders.
     *
     * @param  list<array<string, mixed>>  $orders
     */
    private function claimed(int $at, array $orders): RecordedEvent
    {
        $request = Request::create('/host/orders/claim', 'POST');
        $claim = ['orders' => $orders, 'idle_window_seconds' => 60, 'now' => '2026-11-27T08:00:00Z'];
        $body = (string) json_encode($claim);

        return RecordedEvent::answered($at, RecordedCall::answeredWith(new Response($body), $request));
    }

    /**
     * The host's call to the path at the moment, with the body.
     *
     * @param  array<string, mixed>  $body
     */
    private function asked(int $at, string $path, array $body): RecordedEvent
    {
        $request = Request::create($path, 'POST', content: (string) json_encode($body));

        return RecordedEvent::asked($at, RecordedCall::askedBy($request));
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function order(string $id, string $type, string $processId, array $payload): array
    {
        return [
            'id' => $id,
            'sequence' => 1,
            'type' => $type,
            'process_id' => $processId,
            'payload' => (string) json_encode($payload),
            'expires_at' => '2026-11-27T08:01:00Z',
            'signature' => 'signed',
        ];
    }

    /**
     * @param  list<string>  $argv
     * @return array<string, mixed>
     */
    private function plan(array $argv): array
    {
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Pipe,
            RestartPolicy::Never,
            $argv,
            [],
            '/workspace',
        );

        return $plan->payload()->toArray();
    }

    /**
     * @return array<string, mixed>
     */
    private function report(string $processId, string $report, int $exitCode): array
    {
        return [
            'process_id' => $processId,
            'report' => $report,
            'generation' => 0,
            'exit_code' => $exitCode,
            'evidence' => 'exited',
        ];
    }
}
