<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\ApproveDeviceGrant\ApproveDeviceGrantCommand;
use App\Commands\Projects\RevokeDeviceGrant\RevokeDeviceGrantCommand;
use App\Enums\Connections\BindingReadiness;
use App\Enums\Projects\DeviceGrantStatus;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\ProjectBinding;
use App\Values\InstallTicket;
use Carbon\CarbonImmutable;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A revoked grant is refused while the binding stays connected, and revoking one terminal's sign-in leaves the other
 * working.
 */
#[TestsCommand(RevokeDeviceGrantCommand::class)]
final class RevokeDeviceGrantTest extends TestCase
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

    public function test_a_revoked_grant_is_revoked_while_the_binding_stays_connected(): void
    {
        $binding = $this->connected();
        $this->approvedGrant($binding);
        $grant = DeviceGrant::query()->sole();

        $this->journal->asOwner(new RevokeDeviceGrantCommand($grant->id));

        $this->assertSame(DeviceGrantStatus::Revoked, $grant->refresh()->status);
        $this->assertNotSame(
            BindingReadiness::Revoked,
            ProjectBinding::query()->findOrFail($binding)->readinessAt(CarbonImmutable::now()),
        );
    }

    public function test_revoking_one_terminal_sign_in_leaves_the_other_working(): void
    {
        $binding = $this->connected();
        $first = $this->approvedGrant($binding);
        $this->approvedGrant($binding);
        $revoked = DeviceGrant::query()->where('grant_digest', InstallTicket::digestOf($first))->sole();

        $this->journal->asOwner(new RevokeDeviceGrantCommand($revoked->id));

        $this->assertSame(
            [DeviceGrantStatus::Revoked, DeviceGrantStatus::Issued],
            [$revoked->refresh()->status, DeviceGrant::query()->whereKeyNot($revoked->id)->sole()->status],
        );
    }

    private function approvedGrant(string $binding): string
    {
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->journal->asOwner(new ApproveDeviceGrantCommand((string) $start->json('userCode')));

        return (string) $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->json('grant');
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
