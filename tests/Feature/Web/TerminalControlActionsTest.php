<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\RefusalCode;
use App\Enums\TerminalControlRefusal;
use App\Enums\TerminalGrantState;
use App\Enums\TerminalReceiptOutcome;
use App\Models\AgentRuntime;
use App\Models\Host;
use App\Models\TerminalGrant;
use App\Values\BrowserInputCapabilities;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\InspectOnlyAuthorizer;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * The terminal's JSON control actions: the owner takes, learns the grant from the receipt, sends input, checks the
 * screen and gives the input back; an inspect-only viewer is refused with its own code, and a stale grant's input is
 * refused before anything reaches the host.
 */
final class TerminalControlActionsTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_owner_takes_learns_the_grant_sends_input_checks_and_gives_back(): void
    {
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $takeId = (string) Str::ulid();

        $this->postAction($agentId, 'control/take', ['interest' => $this->openInterest($agentId), 'takeId' => $takeId])
            ->assertOk()
            ->assertJsonPath('state', TerminalGrantState::Taking->value)
            ->assertJsonPath('grantId', null);
        TerminalGrant::query()->acrossActors()->sole()->issue('grant-1');
        $this->receipt($agentId, ['takeId' => $takeId])
            ->assertJsonPath('state', TerminalGrantState::Granted->value)
            ->assertJsonPath('grantId', 'grant-1');

        $input = ['grantId' => 'grant-1', 'text' => 'ls', 'enter' => true, 'sequence' => 1];
        $this->postAction($agentId, 'control/input', $input)
            ->assertOk()
            ->assertJsonPath('nextSequence', 2);
        $this->receipt($agentId, ['takeId' => $takeId, 'sequence' => 1])
            ->assertJsonPath('receipt.outcome', TerminalReceiptOutcome::Pending->value);
        $this->postAction($agentId, 'control/check', ['grantId' => 'grant-1'])->assertOk();
        $this->postAction($agentId, 'control/renew', ['grantId' => 'grant-1'])->assertOk();

        $this->postAction($agentId, 'control/release', ['grantId' => 'grant-1'])
            ->assertOk()
            ->assertJsonPath('state', TerminalGrantState::Releasing->value);
    }

    public function test_an_inspect_only_viewer_is_refused_with_its_own_code(): void
    {
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($agentId);
        $this->app->instance(CurrentAuthorizer::class, new InspectOnlyAuthorizer());
        $refusal = TerminalControlRefusal::InspectOnly->code();

        $this->postAction($agentId, 'control/take', ['interest' => $interest, 'takeId' => (string) Str::ulid()])
            ->assertStatus($refusal->status())
            ->assertJsonPath('code', $refusal->value);
    }

    public function test_a_stale_grant_is_refused_before_anything_reaches_the_host(): void
    {
        $runtime = $this->controllableRuntime();
        $agentId = $runtime->session->agent_id;
        $takeId = (string) Str::ulid();
        $this->postAction($agentId, 'control/take', ['interest' => $this->openInterest($agentId), 'takeId' => $takeId]);
        TerminalGrant::query()->acrossActors()->sole()->issue('grant-1');
        $runtime->reassignTo($runtime->host_id, 'start-token-2');
        $refusal = TerminalControlRefusal::GrantEnded->code();

        $this->postAction($agentId, 'control/input', ['grantId' => 'grant-1', 'text' => 'ls', 'sequence' => 1])
            ->assertStatus($refusal->status())
            ->assertJsonPath('code', $refusal->value);
        $this->postAction($agentId, 'control/renew', ['grantId' => 'grant-1'])
            ->assertStatus($refusal->status());
        $this->postAction($agentId, 'control/input', ['grantId' => 'unknown', 'sequence' => 1])
            ->assertJsonPath('code', RefusalCode::StateBlocked->value);
    }

    private function controllableRuntime(): AgentRuntime
    {
        $host = $this->enrolledHost();
        $everyInput = new BrowserInputCapabilities(true, true, true, true, true);
        Host::query()->whereKey($host->hostId)->sole()->advertiseBrowserInput($everyInput);

        return $this->runtimeOn($host->hostId);
    }

    private function openInterest(string $agentId): string
    {
        return (string) $this->actingAs($this->owner)
            ->postJson("/web/agents/{$agentId}/terminal/interests", ['requestId' => (string) Str::ulid()])
            ->json('readInterestId');
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function postAction(string $agentId, string $action, array $body): TestResponse
    {
        return $this->actingAs($this->owner)->postJson("/web/agents/{$agentId}/terminal/{$action}", $body);
    }

    /**
     * @param  array<string, string|int>  $query
     */
    private function receipt(string $agentId, array $query): TestResponse
    {
        return $this->actingAs($this->owner)
            ->getJson("/web/agents/{$agentId}/terminal/control?".http_build_query($query))
            ->assertOk();
    }
}
