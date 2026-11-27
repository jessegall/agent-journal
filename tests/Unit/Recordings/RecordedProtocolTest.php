<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Agents\ContainerManifest;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\SecurityOptions;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostProcessType;
use App\Recordings\Enums\Wire;
use App\Recordings\Exceptions\RecordingBreaksProtocol;
use App\Recordings\RecordedCall;
use App\Recordings\RecordedEvent;
use App\Recordings\RecordedProtocol;
use App\Recordings\RecordingManifest;
use App\Recordings\RecordingOpening;
use App\Recordings\ScenarioRecording;
use App\Support\MountRules;
use App\Values\ExecutionBudgets;
use App\Values\HostProcessPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\Support\Hosts\TestHost;
use Tests\TestCase;

/**
 * A recording is judged by the generated readers alone: a contained plan naming the host, a payload missing a field
 * and a refused answer without its reason each refuse it, and the coverage names what no recording holds yet.
 */
final class RecordedProtocolTest extends TestCase
{
    public function test_a_contained_plan_naming_a_host_name_refuses_the_recording(): void
    {
        $plan = $this->containedPlan(['JOURNAL_URL={host:JOURNAL_URL}']);
        $recording = $this->recordingOf([$this->claimed([$this->order('open_container', $plan)])]);

        $this->expectException(RecordingBreaksProtocol::class);
        $this->expectExceptionMessage('{host:JOURNAL_URL}');

        $this->app->make(RecordedProtocol::class)->assertKept($recording);
    }

    public function test_a_payload_missing_a_field_refuses_the_recording(): void
    {
        $recording = $this->recordingOf([$this->claimed([$this->order('resize', ['columns' => 80])])]);

        $this->expectException(RecordingBreaksProtocol::class);
        $this->expectExceptionMessage('rows');

        $this->app->make(RecordedProtocol::class)->assertKept($recording);
    }

    public function test_a_refused_answer_without_its_reason_refuses_the_recording(): void
    {
        $answer = ['order_id' => 'o-1', 'status' => 'refused', 'refusal' => 'unsafe'];
        $request = Request::create('/host/orders/o-1', 'POST', content: (string) json_encode($answer));
        $recording = $this->recordingOf([RecordedEvent::asked(1, RecordedCall::askedBy($request))]);

        $this->expectException(RecordingBreaksProtocol::class);
        $this->expectExceptionMessage('reason');

        $this->app->make(RecordedProtocol::class)->assertKept($recording);
    }

    public function test_the_coverage_names_an_order_type_no_recording_holds(): void
    {
        $recording = $this->recordingOf([$this->claimed([$this->order('snapshot', [])])]);

        $coverage = $this->app->make(RecordedProtocol::class)->coverage([$recording]);

        $this->assertSame(
            [false, true],
            [
                in_array(HostOrderType::Snapshot, $coverage->orderTypes, true),
                in_array(HostOrderType::Resize, $coverage->orderTypes, true),
            ],
        );
    }

    /**
     * @param  list<RecordedEvent>  $events
     */
    private function recordingOf(array $events): ScenarioRecording
    {
        $manifest = RecordingManifest::of('scenario', 'claude-code', '2.1.323', 'programs', '2026-11-27', ['01-host']);

        return ScenarioRecording::of($manifest, ['01-host' => [
            'opening' => RecordingOpening::ofCalls(Wire::Host, '01-host')->jsonSerialize(),
            'events' => array_map(
                fn (RecordedEvent $event) => json_decode((string) json_encode($event), true),
                $events,
            ),
            'exit_code' => null,
        ]]);
    }

    /**
     * @param  list<array<string, mixed>>  $orders
     */
    private function claimed(array $orders): RecordedEvent
    {
        $claim = ['orders' => $orders, 'idle_window_seconds' => 60, 'now' => '2026-11-27T08:00:00Z'];
        $request = Request::create('/host/orders/claim', 'POST');

        $answer = RecordedCall::answeredWith(new Response((string) json_encode($claim)), $request);

        return RecordedEvent::answered(1, $answer);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function order(string $type, array $payload): array
    {
        return [
            'id' => '00000000000000000000000001',
            'sequence' => 1,
            'type' => $type,
            'process_id' => '00000000000000000000000002',
            'payload' => (string) json_encode($payload),
            'expires_at' => '2026-11-27T08:01:00Z',
            'signature' => 'signed',
        ];
    }

    /**
     * A contained terminal plan with the environment.
     *
     * @param  list<string>  $environment
     * @return array<string, mixed>
     */
    private function containedPlan(array $environment): array
    {
        $manifest = ContainerManifest::make(
            TestHost::IMAGE,
            '10001:10001',
            true,
            [],
            false,
            'journal-net-test',
            [MountRules::local()->workspaceMount(base_path('storage/framework'), WorkspaceUse::Shared)],
            [],
            ExecutionBudgets::defaults(),
            MountRules::local(),
            SecurityOptions::none(),
            true,
        );
        $plan = new HostProcessPlan(
            HostProcessPurpose::AgentTerminal,
            HostProcessType::Terminal,
            RestartPolicy::Never,
            ['claude'],
            $environment,
            '/workspace',
            $manifest,
        );

        return $plan->payload()->toArray();
    }
}
