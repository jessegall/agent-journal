<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Enums\Connections\ConnectionAuditType;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\ProjectBinding;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * Two tabs revoking one binding get its one revocation time and one audit entry.
 */
final class RevokeProjectBindingTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const string ALREADY_REVOKED = 'Already revoked';

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_two_tabs_revoking_one_binding_get_its_one_revocation_time_and_one_audit(): void
    {
        $this->issueLine('ticket-one');
        $binding = (string) $this->redeemLine('ticket-one', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');

        $first = $this->actingAs($this->owner)
            ->deleteJson("/project-connections/bindings/{$binding}")
            ->assertOk();
        $this->travel(5)->seconds();
        $second = $this->actingAs($this->owner)
            ->deleteJson("/project-connections/bindings/{$binding}")
            ->assertOk();

        $revoked = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame('Revoked', $first->json('result'));
        $this->assertSame(self::ALREADY_REVOKED, $second->json('result'));
        $this->assertSame($first->json('revokedAt'), $second->json('revokedAt'));
        $this->assertSame($revoked->revokedAtText, $second->json('revokedAt'));
        $this->assertSame(2, $revoked->authority_generation);
        $this->assertCount(1, array_filter(
            ConnectionAudit::findNewest(10),
            fn (ConnectionAudit $audit) => $audit->type === ConnectionAuditType::BindingRevoked,
        ));
    }
}
