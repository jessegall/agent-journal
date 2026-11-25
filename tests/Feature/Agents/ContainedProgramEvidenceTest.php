<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Enums\Projects\ArrangementType;
use App\Support\ArrangementSetting;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\DefaultDrivers;
use App\Support\EnrolledHost;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Contained, a driver's arrangement is shown only by a contained host's report that every item is enforced in the
 * agent image; until then a start is refused naming what is missing.
 */
final class ContainedProgramEvidenceTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NO_CLAUDE_REPORT = 'no contained host has reported the protection of claude-code 2.1.323';

    private const string UNENFORCED = "the agent image's protection report leaves "
        .'account-secrets, process-inspection unenforced (%s)';

    private const string CODEX_SHORTFALL = 'no contained host has reported the protection of codex 0.165.0 '
        .'in the agent image for linux-container (journal-agent protection --arrangement=contained)';

    private const string PROTECTED_SHORTFALL = 'no contained host has reported the protection of claude-code 2.1.323 '
        .'in the agent image for linux-container-protected';

    private const array ITEMS = [
        'account-secrets', 'foreign-history', 'keychain', 'control-sockets', 'process-inspection', 'install-writes',
    ];

    public function test_the_local_arrangement_answers_the_pinned_compatibility_as_before(): void
    {
        $this->assertEquals(
            DriverCompatibility::pinned(DefaultDrivers::CLAUDE_CODE),
            $this->compatibility(DefaultDrivers::CLAUDE_CODE),
        );
    }

    private function compatibility(string $driver): DriverCompatibility
    {
        return $this->app->make(DriverCompatibilities::class)->for($driver);
    }

    private function useArrangement(ArrangementType $arrangement): void
    {
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig($arrangement->value, 'journal', '{}'),
        );
    }

    private function containedHost(): EnrolledHost
    {
        $name = 'contained host '.Str::random(6);

        return $this->journal->asSystem(new EnrollHostCommand($name, ['/workspace'], ArrangementType::Contained));
    }

    /**
     * @param  list<array<string, mixed>>  $items
     */
    private function notify(
        EnrolledHost $host,
        string $driver,
        string $build,
        array $items,
        string $platform = 'linux-container',
    ): TestResponse {
        return $this->journal->hostCall($host, 'POST', '/host/reports/protection', [
            'driver' => $driver,
            'build' => $build,
            'platform' => $platform,
            'items' => $items,
        ]);
    }

    /**
     * Every item enforced with evidence, but those named, which give the reason; each item carries both keys, the
     * unused one empty, as journal-agent sends them (client.ProtectionItem).
     *
     * @param  list<string>  $unenforced
     * @return list<array<string, mixed>>
     */
    private function items(array $unenforced, string $reason): array
    {
        return array_map(
            fn (string $item): array => in_array($item, $unenforced, true)
                ? ['item' => $item, 'isEnforced' => false, 'evidence' => '', 'reason' => $reason]
                : ['item' => $item, 'isEnforced' => true, 'evidence' => 'run-1', 'reason' => ''],
            self::ITEMS,
        );
    }
}
