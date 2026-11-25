<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Enums\Terminals\TerminalGrantStatus;
use App\Enums\Terminals\TerminalReceiptOutcome;
use App\Models\Access\User;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\TerminalGrant;
use App\Models\Projects\Host;
use App\Support\Access\AccessSettings;
use App\Values\BrowserInputCapabilities;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
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
            ->assertJsonPath('state', TerminalGrantStatus::Taking->value)
            ->assertJsonPath('grantId', null);
        TerminalGrant::query()->acrossActors()->sole()->issue('grant-1');
        $this->receipt($agentId, ['takeId' => $takeId])
            ->assertJsonPath('state', TerminalGrantStatus::Granted->value)
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
            ->assertJsonPath('state', TerminalGrantStatus::Releasing->value);
    }

    private function controllableRuntime(): AgentRuntime
    {
        $host = $this->journal->enrolledHost();
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
