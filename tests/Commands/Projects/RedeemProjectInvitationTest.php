<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\InstallAttempt;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectInvitation;
use App\Projects\Commands\RedeemProjectInvitation\RedeemProjectInvitationCommand;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * One redemption of an install line makes exactly one host, one binding and one main agent, in one transaction; every
 * other redemption of it gets the same generic failure.
 */
#[TestsCommand(RedeemProjectInvitationCommand::class)]
final class RedeemProjectInvitationTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits',
        'project_invitations',
        'install_attempts',
        'project_bindings',
        'project_environments',
        'projects',
        'agent_runtimes',
        'agents',
        'hosts',
        'settings_records',
        'users',
        'command_receipts',
        'agent_sessions',
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
        $this->assertNull($reply->json('protocol'));
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

    public function test_a_new_line_makes_one_project_with_one_main_environment_and_the_binding_in_it(): void
    {
        $binding = $this->connected('new-ticket', 'nonce-aaaaaaaaaaaaaaaa');

        $environments = Environment::query()->where('project_id', $binding->project_id)->get();
        $this->assertSame(1, Project::query()->count());
        $this->assertSame([Environment::DEFAULT_LABEL], $environments->pluck('label')->all());
        $this->assertSame($environments->sole()->id, $binding->environment_id);
    }

    public function test_a_join_line_lands_in_the_environment_it_names(): void
    {
        $first = $this->connected('new-ticket', 'nonce-aaaaaaaaaaaaaaaa');
        $research = Environment::create(Project::query()->sole(), 'Research');
        $ticket = $this->joinTicket($first->project_id, $research->id);

        $joined = $this->redeemLine($ticket, 'nonce-bbbbbbbbbbbbbbbb')->assertCreated();

        $binding = ProjectBinding::query()->findOrFail($joined->json('bindingId'));
        $this->assertSame($research->id, $binding->environment_id);
    }

    public function test_a_join_line_whose_environment_is_gone_is_refused_and_stays_unspent(): void
    {
        $first = $this->connected('new-ticket', 'nonce-aaaaaaaaaaaaaaaa');
        $research = Environment::create(Project::query()->sole(), 'Research');
        $ticket = $this->joinTicket($first->project_id, $research->id);
        $research->delete();

        $this->redeemLine($ticket, 'nonce-bbbbbbbbbbbbbbbb')->assertNotFound();

        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
        $this->assertSame(1, ProjectBinding::query()->count());
    }

    public function test_replacing_one_tabs_attempt_leaves_the_other_tabs_line_usable(): void
    {
        $tabA = $this->issuedLine(['issuanceKey' => 'tab-a']);
        $tabB = $this->issuedLine(['issuanceKey' => 'tab-b']);

        $this->issuedLine([
            'issuanceKey' => 'tab-a',
            'attemptReference' => $tabA['attemptReference'],
            'seenVersion' => $tabA['attemptVersion'],
        ]);

        $this->assertNotSame($tabA['attemptReference'], $tabB['attemptReference']);
        $this->assertSame(2, ProjectInvitation::query()->pending()->count());
        $this->assertNotNull(ProjectInvitation::query()->pending()->find($tabB['invitationId']));
        $this->assertNull(ProjectInvitation::query()->pending()->find($tabA['invitationId']));
    }

    public function test_two_replacements_from_the_same_version_leave_one_live_line(): void
    {
        $issued = $this->issuedLine(['issuanceKey' => 'tab-a']);
        $replacement = [
            'issuanceKey' => 'tab-a',
            'attemptReference' => $issued['attemptReference'],
            'seenVersion' => $issued['attemptVersion'],
        ];

        $this->issuedLine($replacement);
        $stale = $this->refusedLine($replacement);

        $this->assertSame('install-attempt-refused', $stale);
        $this->assertSame(2, InstallAttempt::query()->sole()->version);
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
    }

    public function test_a_lost_reply_is_replaced_by_the_attempts_reference_without_a_second_attempt(): void
    {
        $issued = $this->issuedLine(['issuanceKey' => 'tab-a']);

        $again = $this->issuedLine(['issuanceKey' => 'tab-a', 'attemptReference' => $issued['attemptReference']]);

        $this->assertSame($issued['attemptReference'], $again['attemptReference']);
        $this->assertSame(1, InstallAttempt::query()->count());
        $this->assertSame(1, ProjectInvitation::query()->pending()->count());
    }

    public function test_a_spent_attempt_answers_its_binding_and_issues_no_new_line(): void
    {
        $issued = $this->issuedLine(['issuanceKey' => 'tab-a']);
        preg_match('#/install/([A-Za-z0-9_-]+)#', (string) $issued['installLine'], $ticket);
        $binding = $this->redeemLine($ticket[1], 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');

        $stale = $this->refusedLine(['issuanceKey' => 'tab-a', 'attemptReference' => $issued['attemptReference']]);

        $this->assertIsString($stale);
        $this->assertSame($binding, InstallAttempt::query()->sole()->binding_id);
        $this->assertSame(0, ProjectInvitation::query()->pending()->count());
    }

    /**
     * @param  TestResponse<Response>  $response
     */
    private function assertGeneric(TestResponse $response): void
    {
        $response->assertNotFound()->assertJsonPath('message', self::GENERIC)->assertJsonPath('details', []);
    }

    private function connected(string $ticket, string $nonce): ProjectBinding
    {
        $this->issueLine($ticket);

        $redeemed = $this->redeemLine($ticket, $nonce)->assertCreated();
        $this->notifyClaudeCode($nonce, (string) $redeemed->json('bindingId'));

        return ProjectBinding::query()->findOrFail($redeemed->json('bindingId'));
    }

    private function joinTicket(string $projectId, string $environmentId): string
    {
        $issued = $this->issuedLine([
            'issuanceKey' => 'join-'.Str::random(6),
            'projectId' => $projectId,
            'environmentId' => $environmentId,
        ]);
        preg_match('#/install/([A-Za-z0-9_-]+)#', (string) $issued['installLine'], $ticket);

        return $ticket[1];
    }
}
