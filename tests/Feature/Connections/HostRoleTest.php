<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\Projects\ArrangementType;
use App\Models\Projects\Host;
use App\Models\Projects\ProjectBinding;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A host is a folder's relay when a project binding names it, and enrolled otherwise; starts choose only enrolled
 * hosts.
 */
final class HostRoleTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_a_host_a_binding_names_is_a_relay_and_any_other_is_enrolled(): void
    {
        $this->issueLine('the-ticket');
        $binding = ProjectBinding::query()->findOrFail(
            $this->redeemLine('the-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId'),
        );
        $enrolled = Host::create('enrolled', 'secret', ['/srv'], ArrangementType::Local);

        $this->assertSame(
            [true, false, [$enrolled->id]],
            [
                Host::query()->findOrFail($binding->host_id)->isConnectedFolderRelay(),
                $enrolled->isConnectedFolderRelay(),
                array_map(fn (Host $host) => $host->id, Host::servingEnrolled()),
            ],
        );
    }
}
