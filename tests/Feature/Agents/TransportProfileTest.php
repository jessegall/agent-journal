<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Actions\RegisterPendingStart;
use App\Agents\Enums\TransportProfileType;
use App\Agents\Support\SelectedAccount;
use App\Records\Contracts\IdentityLinks;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\TestCase;

final class TransportProfileTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

    private const array TABLES = ['process_starts', 'agents', 'agent_sessions', 'start_tokens', 'agent_stacks'];

    public function test_switching_transport_applies_at_registration_and_existing_mcp_still_answers(): void
    {
        $this->mock(IdentityLinks::class)->shouldReceive('link')->times(3);
        $account = new SelectedAccount(new RecordIdentity('accounts', (string) Str::ulid()), 'claude', '/account', 1);
        $starts = $this->app->make(RegisterPendingStart::class);
        $config = $this->app->make(Repository::class);
        $caller = TestStart::start();
        $earlier = $starts->register($caller->session, $account);

        $config->set('agents.transport_profile', 'cli');
        $cli = $starts->register(TestStart::start()->session, $account);
        $this->callMcpTool($caller, 'overview_read')->assertJsonPath('result.isError', false);

        $config->set('agents.transport_profile', 'mcp');
        $restored = $starts->register(TestStart::start()->session, $account);

        $this->assertSame(TransportProfileType::Mcp, $earlier->refresh()->transport_profile);
        $this->assertSame(TransportProfileType::Cli, $cli->refresh()->transport_profile);
        $this->assertSame(TransportProfileType::Mcp, $restored->refresh()->transport_profile);
        $this->assertSame($earlier->settingsIdentity(), $restored->settingsIdentity());
    }
}
