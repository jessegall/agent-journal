<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\HostProtocolMismatch;
use App\Agents\Models\Host;
use App\Agents\Models\StartRecord;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\HostDescriptorEnrollment;
use App\Drivers\Support\DefaultDrivers;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

final class HostProtocolTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = ['hosts', 'agent_runtimes', 'start_records', 'hook_calls'];

    private const string CLAIM = '/host/claim?limit=1&wait=0&watched_version=0';

    public function test_a_host_that_names_no_protocol_is_refused_before_it_claims_anything(): void
    {
        $host = $this->enrolledHost();
        $records = StartRecord::query()->withoutGlobalScopes()->count();

        $this->signedHostCall($host, 'POST', self::CLAIM, '', protocol: null)
            ->assertStatus(426)
            ->assertJsonPath('message', HostProtocolMismatch::missing(HostProtocolVersion::current()->value)->getMessage());

        $this->assertSame($records, StartRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_a_host_of_another_protocol_is_told_to_upgrade(): void
    {
        $host = $this->enrolledHost();
        $other = HostProtocolVersion::current()->value + 1;

        $this->signedHostCall($host, 'POST', self::CLAIM, '', protocol: $other)
            ->assertStatus(426)
            ->assertJsonPath('message', HostProtocolMismatch::speaks((string) $other, HostProtocolVersion::current()->value)->getMessage())
            ->assertJsonPath('protocolVersions', HostProtocolVersion::spoken());
    }

    public function test_a_host_enrolls_the_four_default_drivers_it_advertises(): void
    {
        $host = $this->enrolledHost();
        $this->hostCall($host, self::CLAIM)->assertOk();
        $keys = ['claude-code', 'claude-code-headless', 'codex', 'codex-headless'];

        $this->report($host, array_map(fn (string $key) => $this->descriptor($key), $keys))->assertNoContent();

        $stored = Host::query()->findOrFail($host->hostId);
        $this->assertSame(HostProtocolVersion::current()->value, $stored->protocol_version);
        $this->assertSame($keys, array_column($stored->descriptors, 'key'));
        $this->assertSame([null, null, null, null], array_column($stored->descriptors, 'unavailable_reason'));
    }

    public function test_an_incompatible_protocol_or_unknown_key_is_unavailable_while_the_others_stay_selectable(): void
    {
        $host = $this->enrolledHost();
        $this->hostCall($host, self::CLAIM)->assertOk();

        $this->report($host, [
            $this->descriptor('claude-code'),
            $this->descriptor('codex-headless', DefaultDrivers::PROTOCOL_VERSION + 1),
            $this->descriptor('acme/reader'),
        ])->assertNoContent();

        $this->assertSame(
            [null, HostDescriptorEnrollment::PROTOCOL_INCOMPATIBLE, HostDescriptorEnrollment::UNKNOWN_DRIVER],
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
        return $this->hostCall($host, '/host/reports/descriptors', [
            'protocolVersion' => HostProtocolVersion::current()->value,
            'descriptors' => $descriptors,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function descriptor(string $key, int $protocolVersion = DefaultDrivers::PROTOCOL_VERSION): array
    {
        return [
            'key' => $key,
            'build' => '2.1.323',
            'protocolVersion' => $protocolVersion,
            'arrangement' => 'local',
            'placement' => 'protected_host',
        ];
    }
}
