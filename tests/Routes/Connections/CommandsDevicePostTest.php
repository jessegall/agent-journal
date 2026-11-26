<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\ApproveDeviceGrant\ApproveDeviceGrantCommand;
use App\Support\EnrolledHost;
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

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
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
}
