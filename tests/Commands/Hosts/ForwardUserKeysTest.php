<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\ForwardUserKeys\ForwardUserKeysCommand;
use App\Hosts\Enums\HostOrderType;
use App\Values\HostOrderSource;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user's keys go to the host at once with no guard, lapse after five seconds, and raise the process's input
 * generation, so a guarded write of the journal made before them is refused.
 */
#[TestsCommand(ForwardUserKeysCommand::class)]
final class ForwardUserKeysTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NOW = '2026-11-26 10:00:00';

    public function test_the_keys_go_unguarded_as_the_users_and_raise_the_input_generation(): void
    {
        $this->journal
            ->useServerClockAt(CarbonImmutable::parse(self::NOW))
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'));
        $process = $this->journal->hostProcessCalled('shell');

        $id = $this->journal->asSystem(new ForwardUserKeysCommand(
            $process->id,
            "hi\r",
            HostOrderSource::fromJournal(),
        ));
        $order = $this->journal->hostOrdersOf('shell')[1];

        $this->journal->assertResult(
            [
                $id,
                HostOrderType::WriteKeys,
                ['bytes' => base64_encode("hi\r"), 'as_user' => true],
                CarbonImmutable::parse(self::NOW)->addSeconds(5)->toIso8601String(),
                $process->input_generation + 1,
            ],
            [
                $order->id,
                $order->type,
                $this->journal->payloadOf($order),
                $order->expires_at->toIso8601String(),
                $this->journal->hostProcessCalled('shell')->input_generation,
            ],
        );
    }
}
