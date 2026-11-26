<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\RecoverProjectBinding\RecoverProjectBindingCommand;
use App\Support\EnrolledHost;
use App\Values\Redemption;
use Illuminate\Support\Str;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * A relay that lost what it redeemed recovers its binding by its installation nonce.
 */
#[TestsRoute('POST', 'connections.recover')]
final class RecoverPostTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    private const string NONCE = 'nonce-0123456789abcdef';

    protected function arrange(TestJournal $journal): RouteCall
    {
        [$relay, $bindingId] = $this->redeemedRelay();

        return RouteCall::as(Caller::Public, $relay)
            ->payload([
                'installationNonce' => self::NONCE,
            ])
            ->reply(RecoverProjectBindingCommand::class, new Redemption(
                $relay->hostId,
                TestProjects::local()->id,
                $bindingId,
                strtolower((string) Str::ulid()),
                'Shop',
            ))
            ->expects(RecoverProjectBindingCommand::class, [
                'hostId' => $relay->hostId,
                'installationNonce' => self::NONCE,
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
}
