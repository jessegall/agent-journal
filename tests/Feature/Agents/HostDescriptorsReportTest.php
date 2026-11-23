<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Models\Projects\Host;
use App\Support\EnrolledHost;
use App\Support\HostDescriptorEnrollment;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * A host reports the drivers it can run, and each is enrolled or marked unavailable with its reason.
 */
final class HostDescriptorsReportTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = ['hosts', 'agent_runtimes', 'start_records', 'hook_calls'];

    private const string CLAIM = '/host/claim?limit=1&wait=0&watched_version=0';

    public function test_a_host_enrolls_the_four_default_drivers_it_advertises(): void
    {
        $host = $this->enrolledHost();
        $this->hostCall($host, self::CLAIM)->assertOk();
        $keys = ['claude-code', 'claude-code-headless', 'codex', 'codex-headless'];

        $this->report($host, array_map(fn (string $key) => $this->descriptor($key), $keys))->assertNoContent();

        $stored = Host::query()->findOrFail($host->hostId);
        $this->assertSame($keys, array_column($stored->descriptors, 'key'));
        $this->assertSame([null, null, null, null], array_column($stored->descriptors, 'unavailable_reason'));
    }

    public function test_an_unknown_key_is_unavailable_while_the_others_stay_selectable(): void
    {
        $host = $this->enrolledHost();
        $this->hostCall($host, self::CLAIM)->assertOk();

        $this->report($host, [
            $this->descriptor('claude-code'),
            $this->descriptor('acme/reader'),
        ])->assertNoContent();

        $this->assertSame(
            [null, HostDescriptorEnrollment::UNKNOWN_DRIVER],
            array_column(Host::query()->findOrFail($host->hostId)->descriptors, 'unavailable_reason'),
        );
    }

    public function test_a_driver_advertised_twice_refuses_the_report(): void
    {
        $host = $this->enrolledHost();
        $this->hostCall($host, self::CLAIM)->assertOk();

        $this->report($host, [$this->descriptor('claude-code'), $this->descriptor('claude-code')])
            ->assertStatus(409);

        $this->assertSame([], Host::query()->findOrFail($host->hostId)->descriptors);
    }

    /**
     * @param  list<array<string, mixed>>  $descriptors
     */
    private function report(EnrolledHost $host, array $descriptors): TestResponse
    {
        return $this->hostCall($host, '/host/reports/descriptors', ['descriptors' => $descriptors]);
    }

    /**
     * @return array<string, mixed>
     */
    private function descriptor(string $key): array
    {
        return [
            'key' => $key,
            'build' => '2.1.323',
            'arrangement' => 'local',
            'placement' => 'protected_host',
        ];
    }
}
