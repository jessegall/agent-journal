<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\Environment;
use App\Connections\Models\InstallAttempt;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Values\InstallTicket;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * Revoking a binding ends its host and raises its generation, leaves the project's other bindings working, and every
 * step of connecting is audited without a secret.
 */
final class BindingRevocationTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_a_revoked_bindings_host_is_refused_while_the_projects_other_binding_answers(): void
    {
        $this->issueLine('ticket-one');
        $first = ProjectBinding::query()->findOrFail(
            $this->redeemLine('ticket-one', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId'),
        );
        ProjectInvitation::create(
            InstallAttempt::openFor($this->owner->id, 'join-action', $this->mainOf(Project::query()->sole())),
            InstallTicket::digestOf('ticket-two'),
        );
        $this->redeemLine('ticket-two', 'nonce-bbbbbbbbbbbbbbbb')->assertCreated();

        $this->actingAs($this->owner)
            ->deleteJson("/settings/project-connections/bindings/{$first->id}")
            ->assertNoContent();

        $this->relayClaim('nonce-aaaaaaaaaaaaaaaa')->assertUnauthorized();
        $revoked = ProjectBinding::query()->findOrFail($first->id);
        $this->assertSame(BindingReadiness::Revoked, $revoked->readinessAt(CarbonImmutable::now()));
        $this->assertSame(2, $revoked->authority_generation);
        $this->assertSame(2, ProjectBinding::query()->where('project_id', $first->project_id)->count());
        $this->recoverBinding('nonce-bbbbbbbbbbbbbbbb')->assertOk();
    }

    public function test_several_chosen_bindings_are_revoked_at_once_each_with_its_outcome(): void
    {
        $this->issueLine('ticket-one');
        $first = (string) $this->redeemLine('ticket-one', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');
        ProjectInvitation::create(
            InstallAttempt::openFor($this->owner->id, 'join-action', $this->mainOf(Project::query()->sole())),
            InstallTicket::digestOf('ticket-two'),
        );
        $second = (string) $this->redeemLine('ticket-two', 'nonce-bbbbbbbbbbbbbbbb')->assertCreated()->json('bindingId');

        $this->actingAs($this->owner)
            ->from('/connections')
            ->post('/settings/project-connections/bindings/revoke', ['bindings' => [$first, $second]])
            ->assertRedirect('/connections')
            ->assertSessionHas('inertia.flash_data', ['revokedBindings' => [$first => 'Revoked', $second => 'Revoked']]);

        $this->assertSame(
            [BindingReadiness::Revoked, BindingReadiness::Revoked],
            ProjectBinding::query()->orderBy('created_at')->get()
                ->map(fn (ProjectBinding $binding) => $binding->readiness)->all(),
        );
    }

    public function test_every_step_is_audited_with_its_actor_and_no_secret(): void
    {
        $this->issueByOwner('action-1');
        $line = $this->issueByOwner('action-1');
        preg_match('#/install/([A-Za-z0-9_-]+) #', (string) $line->json('installLine'), $match);
        $binding = $this->redeemLine($match[1], 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');
        $this->recoverBinding('nonce-aaaaaaaaaaaaaaaa')->assertOk();
        $this->actingAs($this->owner)->deleteJson("/settings/project-connections/bindings/{$binding}")->assertNoContent();

        $audits = array_reverse(ConnectionAudit::newest(10));

        $this->assertSame(
            [
                ConnectionAuditType::Issued,
                ConnectionAuditType::Replaced,
                ConnectionAuditType::Redeemed,
                ConnectionAuditType::Recovered,
                ConnectionAuditType::BindingRevoked,
            ],
            array_map(fn (ConnectionAudit $audit) => $audit->type, $audits),
        );
        $stored = (string) json_encode(array_map(fn (ConnectionAudit $audit) => $audit->getAttributes(), $audits));
        $this->assertStringNotContainsString($match[1], $stored);
        $this->assertStringNotContainsString($this->relayCredential('nonce-aaaaaaaaaaaaaaaa'), $stored);
        $this->assertStringNotContainsString('/Users/owner/shop', $stored);
    }

    private function issueByOwner(string $issuanceKey): TestResponse
    {
        return $this->actingAs($this->owner)
            ->postJson('/settings/project-connections/invitations', ['issuanceKey' => $issuanceKey])
            ->assertCreated();
    }

    private function relayClaim(string $nonce): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            '/host/claim?limit=1&wait=0&watched_version=0',
            [],
            HostProtocolVersion::First,
            (string) Str::uuid(),
        );
    }

    private function recoverBinding(string $nonce): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            '/api/project-connections/recover',
            ['installationNonce' => $nonce],
            HostProtocolVersion::RemoteProject,
            (string) Str::uuid(),
        );
    }

    /**
     * The project's Main environment, which its first line made.
     */
    private function mainOf(Project $project): Environment
    {
        return Environment::listedOf($project->id)[0];
    }
}
