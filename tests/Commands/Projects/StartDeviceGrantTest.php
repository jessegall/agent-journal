<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Models\Projects\DeviceGrant;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * Two terminals get two references, and a repeated start finds its own.
 */
final class StartDeviceGrantTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'assignments', 'tasks', 'command_receipts', 'device_grants', 'connection_audits', 'project_invitations',
        'install_attempts', 'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_two_terminals_get_two_references_and_a_repeated_start_finds_its_own(): void
    {
        $binding = $this->connected();

        $first = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'terminal-a'])->assertCreated();
        $second = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'terminal-b'])->assertCreated();
        $again = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'terminal-a'])->assertCreated();

        $this->assertNotSame($first->json('reference'), $second->json('reference'));
        $this->assertSame([1, 2], [$first->json('generation'), $second->json('generation')]);
        $this->assertSame($first->json('reference'), $again->json('reference'));
        $this->assertSame(2, DeviceGrant::query()->count());
    }

    private function connected(): string
    {
        $this->issueLine('the-ticket');

        return (string) $this->redeemLine('the-ticket', self::NONCE)->assertCreated()->json('bindingId');
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function relay(string $target, array $body): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            $target,
            $body,
            (string) Str::uuid(),
        );
    }
}
