<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Models\Agent;
use App\Agents\Models\Host;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectInvitation;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * One redemption of an install line makes exactly one host, one binding and one main agent, in one transaction; every
 * other redemption of it gets the same generic failure.
 */
final class RedemptionTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'project_bindings', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    private const string TICKET = 'Tk3_x-9QvZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0u';

    private const string GENERIC = 'This install line cannot be used.';

    public function test_a_redemption_makes_exactly_one_host_binding_and_main_agent_and_spends_the_line(): void
    {
        $invitation = $this->issueLine(self::TICKET);
        $hosts = Host::query()->count();
        $agents = Agent::query()->count();

        $reply = $this->redeemLine(self::TICKET, 'nonce-aaaaaaaaaaaaaaaa')->assertCreated();

        $binding = ProjectBinding::query()->sole();
        $this->assertSame($hosts + 1, Host::query()->count());
        $this->assertSame($agents + 1, Agent::query()->count());
        $this->assertSame($binding->id, $reply->json('bindingId'));
        $this->assertSame($binding->host_id, $reply->json('hostId'));
        $this->assertSame($binding->project_id, $reply->json('projectId'));
        $this->assertSame(HostProtocolVersion::RemoteProject->value, $reply->json('protocol'));
        $this->assertSame('https://journal.example.com', $reply->json('canonicalOrigin'));
        $this->assertSame(
            Host::hashOf($this->relayCredential('nonce-aaaaaaaaaaaaaaaa')),
            Host::query()->findOrFail($binding->host_id)->credential_hash,
        );
        $this->assertSame($binding->id, $invitation->fresh()?->binding_id);
        $this->assertSame('Shop', Project::query()->sole()->label);
    }

    public function test_a_second_redemption_an_expired_revoked_or_wrong_ticket_get_the_same_generic_failure(): void
    {
        $this->issueLine(self::TICKET);
        $this->redeemLine(self::TICKET, 'nonce-aaaaaaaaaaaaaaaa')->assertCreated();

        $this->assertGeneric($this->redeemLine(self::TICKET, 'nonce-bbbbbbbbbbbbbbbb'));
        $this->assertGeneric($this->redeemLine('wrong-ticket', 'nonce-cccccccccccccccc'));

        $revoked = $this->issueLine('revoked-ticket');
        $revoked->revoke();
        $this->assertGeneric($this->redeemLine('revoked-ticket', 'nonce-dddddddddddddddd'));

        $this->issueLine('expired-ticket');
        $this->travel(ProjectInvitation::LIFETIME_MINUTES + 1)->minutes();
        $this->assertGeneric($this->redeemLine('expired-ticket', 'nonce-eeeeeeeeeeeeeeee'));

        $this->assertSame(1, ProjectBinding::query()->count());
    }

    public function test_a_failure_inside_the_transaction_leaves_no_host_and_the_line_still_usable(): void
    {
        $this->issueLine('first-ticket');
        $this->redeemLine('first-ticket', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated();
        $this->issueLine(self::TICKET);
        $hosts = Host::query()->count();

        $this->redeemLine(self::TICKET, 'nonce-aaaaaaaaaaaaaaaa')->assertServerError();

        $this->assertSame($hosts, Host::query()->count());
        $this->assertSame(1, ProjectBinding::query()->count());
        $this->redeemLine(self::TICKET, 'nonce-ffffffffffffffff')->assertCreated();
    }

    public function test_the_same_label_twice_makes_two_distinct_bindings(): void
    {
        $this->issueLine('ticket-one');
        $this->issueLine('ticket-two');

        $this->redeemLine('ticket-one', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated();
        $this->redeemLine('ticket-two', 'nonce-bbbbbbbbbbbbbbbb')->assertCreated();

        $this->assertSame(2, ProjectBinding::query()->count());
        $this->assertSame(2, Project::query()->distinct()->count('key'));
    }

    public function test_a_redemption_without_tls_is_refused(): void
    {
        $this->issueLine(self::TICKET);

        $this->postJson('http://localhost/api/project-connections/redeem', $this->redemptionBody(self::TICKET, 'nonce-aaaaaaaaaaaaaaaa'))
            ->assertForbidden();

        $this->assertSame(0, ProjectBinding::query()->count());
    }

    /**
     * @param  TestResponse<Response>  $response
     */
    private function assertGeneric(TestResponse $response): void
    {
        $response->assertNotFound()->assertJsonPath('message', self::GENERIC)->assertJsonPath('details', []);
    }
}
