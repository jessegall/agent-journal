<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\HostProtocolMismatch;
use App\Agents\Models\Host;
use App\Agents\Models\StartRecord;
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
            ->assertJsonPath('message', HostProtocolMismatch::speaks((string) $other, HostProtocolVersion::current()->value)->getMessage());
    }

    public function test_a_host_of_this_protocol_claims_and_keeps_its_version_and_combinations(): void
    {
        $host = $this->enrolledHost();
        $this->hostCall($host, self::CLAIM)->assertOk();

        $combination = [
            'driver' => 'claude-code',
            'build' => '2.1.323',
            'arrangement' => 'local',
            'placement' => 'protected_host',
            'variant' => 'headless',
        ];
        $this->hostCall($host, '/host/reports/combinations', [
            'protocolVersion' => HostProtocolVersion::current()->value,
            'combinations' => [$combination],
        ])->assertNoContent();

        $stored = Host::query()->findOrFail($host->hostId);
        $this->assertSame(HostProtocolVersion::current()->value, $stored->protocol_version);
        $this->assertEquals([$combination], $stored->combinations);
    }
}
