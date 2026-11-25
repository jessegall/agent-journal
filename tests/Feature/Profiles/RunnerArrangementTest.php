<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Enums\Projects\ArrangementType;
use App\Exceptions\RunnerArrangementRefused;
use App\Support\ArrangementSetting;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * One journal never runs both sign-in runners: a runner of the other arrangement is refused on every claim before
 * anything is claimed.
 */
final class RunnerArrangementTest extends TestCase
{
    use RefreshHookDatabase;

    private const array CLAIMS = [
        '/host/sign-ins/claim',
        '/host/accounts/checks/claim',
        '/host/accounts/cleanups/claim',
    ];

    public function test_a_runner_of_the_journals_own_arrangement_claims_as_before(): void
    {
        $host = $this->journal->enrolledHost();

        foreach (self::CLAIMS as $claim) {
            $this->assertNotSame(409, $this->journal->hostCall($host, 'POST', $claim)->status(), $claim);
            $this->assertNotSame(
                409,
                $this->journal->hostCall($host, 'POST', $claim.'?arrangement=local')->status(),
                $claim,
            );
        }
    }

    public function test_a_contained_journal_refuses_a_local_runner_on_every_claim(): void
    {
        $this->app->instance(ArrangementSetting::class, ArrangementSetting::fromConfig('contained', 'journal', '{}'));
        $host = $this->journal->enrolledHost();
        $refusal = RunnerArrangementRefused::between(ArrangementType::Contained, ArrangementType::Local);

        foreach (self::CLAIMS as $claim) {
            $this->journal->hostCall($host, 'POST', $claim)->assertStatus(409)->assertJsonPath(
                'message',
                $refusal->getMessage(),
            );
            $this->assertNotSame(
                409,
                $this->journal->hostCall($host, 'POST', $claim.'?arrangement=contained')->status(),
                $claim,
            );
        }
    }

    public function test_a_local_journal_refuses_a_contained_runner(): void
    {
        $host = $this->journal->enrolledHost();

        foreach (self::CLAIMS as $claim) {
            $this->journal->hostCall($host, 'POST', $claim.'?arrangement=contained')->assertStatus(409);
        }
    }
}
