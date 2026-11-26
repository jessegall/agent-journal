<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Access\AccessSettings;
use App\Hosts\EnrolledHost;
use App\Models\Access\User;
use App\Models\Projects\DeviceGrant;
use App\Projects\Commands\ApproveDeviceGrant\ApproveDeviceGrantCommand;
use App\Projects\Commands\RevokeDeviceGrant\RevokeDeviceGrantCommand;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * A terminal signed in on a binding reads its project overview: nothing is sent on.
 */
#[TestsRoute('POST', 'connections.commands.device')]
final class CommandsDevicePostTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    private const string SESSION_USE_REFUSAL = 'runs in a provider session';

    private const string REVOKED_REFUSAL = 'can no longer use the journal';

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_grant_serves_only_the_overview_of_its_own_binding(): void
    {
        $call = $this->arrangedCall();
        $grant = (string) $call->signer;
        $other = (string) Str::ulid();

        $this->assertStringContainsString(
            self::SESSION_USE_REFUSAL,
            (string) $this->deviceCommand($grant, $call->payload['binding'], ['overview', 'now'])->assertForbidden()->json('message'),
        );
        $this->assertStringContainsString(
            $other,
            (string) $this->deviceCommand($grant, $other, ['overview'])->assertForbidden()->json('message'),
        );
    }

    public function test_a_grant_whose_approver_the_journal_no_longer_admits_is_refused(): void
    {
        $call = $this->arrangedCall();
        $this->app->instance(AccessSettings::class, new AccessSettings(User::factory()->create()->id));

        $this->assertStringContainsString(
            self::REVOKED_REFUSAL,
            (string) $this->send($call, $call->caller)->assertForbidden()->json('message'),
        );
    }

    public function test_a_revoked_grant_is_refused(): void
    {
        $call = $this->arrangedCall();
        $this->journal->asOwner(new RevokeDeviceGrantCommand(DeviceGrant::query()->sole()->id));

        $this->send($call, $call->caller)->assertUnauthorized();
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        [, $bindingId] = $this->redeemedRelay();
        $started = $this->relay('/api/device-grants', [
            'binding' => $bindingId,
        ])->assertCreated();
        $journal->run(new ApproveDeviceGrantCommand((string) $started->json('userCode')));
        $grant = (string) $this->relay('/api/device-grants/poll', [
            'deviceCode' => $started->json('deviceCode'),
        ])->json('grant');

        return RouteCall::as(Caller::DeviceGrant, $grant)
            ->payload([
                'request_key' => 'overview-1',
                'binding' => $bindingId,
                'argv' => [
                    'overview',
                ],
                'stdin' => null,
            ]);
    }

    /**
     * The relay a redeemed install line enrolled, signing with the credential it redeemed with, and its binding.
     *
     * @return array{EnrolledHost, string}
     */
    private function redeemedRelay(): array
    {
        $this->issueLine('the-ticket');
        $redemption = $this->redeemLine('the-ticket', self::NONCE)->assertCreated();

        return [
            new EnrolledHost((string) $redemption->json('hostId'), $this->relayCredential(self::NONCE)),
            (string) $redemption->json('bindingId'),
        ];
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function relay(string $target, array $body): TestResponse
    {
        return $this->signedRelayCall($this->relayCredential(self::NONCE), $target, $body, (string) Str::uuid());
    }

    /**
     * A device command under the grant for the binding, with these words.
     *
     * @param  list<string>  $argv
     */
    private function deviceCommand(string $grant, string $binding, array $argv): TestResponse
    {
        return $this->send(RouteCall::as(Caller::DeviceGrant, $grant)->payload([
            'request_key' => 'request-'.Str::random(6),
            'binding' => $binding,
            'argv' => $argv,
            'stdin' => null,
        ]), Caller::DeviceGrant);
    }
}
