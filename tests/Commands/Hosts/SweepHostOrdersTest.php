<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Commands\SweepHostOrders\SweepHostOrdersCommand;
use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Enums\HostRefusal;
use App\Values\HostOrderSource;
use App\Values\RowGuard;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An order nobody answered in time expires on the journal's clock, a key write forgets its bytes once answered, and
 * answered orders are deleted after their hour.
 */
#[TestsCommand(SweepHostOrdersCommand::class)]
final class SweepHostOrdersTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_unanswered_order_expires_answered_keys_forget_their_bytes_and_old_orders_go(): void
    {
        $this->journal
            ->useServerClockAt(CarbonImmutable::parse('2026-11-26 10:00:00'))
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell');
        $process = $this->journal->hostProcessCalled('shell')->id;
        $keys = new SendHostKeysCommand($process, 'hi', new RowGuard(0, 0, 'rows'), 0, HostOrderSource::fromJournal());
        $this->journal->asSystem($keys);
        [$open, $typed] = $this->journal->hostOrdersOf('shell');
        $this->journal->answerHostOrder($typed);
        $erased = $this->journal->payloadOf($typed->refresh());

        $this->journal->moveServerClockTo(CarbonImmutable::parse('2026-11-26 10:01:00'));
        $this->journal->asSystem(new SweepHostOrdersCommand());
        $open->refresh();
        $afterExpiry = [$open->status, $open->refusal];
        $this->journal->moveServerClockTo(CarbonImmutable::parse('2026-11-26 12:00:00'));
        $this->journal->asSystem(new SweepHostOrdersCommand());

        $this->journal->assertResult(
            [[], [HostOrderStatus::Refused, HostRefusal::Expired], []],
            [$erased, $afterExpiry, $this->journal->hostOrdersOf('shell')],
        );
    }
}
