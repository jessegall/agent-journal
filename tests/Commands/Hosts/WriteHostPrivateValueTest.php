<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\WriteHostPrivateValue\WriteHostPrivateValueCommand;
use App\Hosts\Enums\HostOrderType;
use App\Values\HostOrderSource;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The write of a private value is ordered on the process's host by its submission alone: the order holds no value.
 */
#[TestsCommand(WriteHostPrivateValueCommand::class)]
final class WriteHostPrivateValueTest extends TestCase
{
    use RefreshHookDatabase;

    private const string VALUE = 'sk-ant-secret';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->enrollHost('Pi', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('claude'))
            ->hostProcess('claude', fn (TestHostProcess $claude) => $claude
                ->submitPrivateValue('submission-1', self::VALUE));
        $process = $this->journal->hostProcessCalled('claude')->id;
        $this->journal->asSystem(new WriteHostPrivateValueCommand(
            $process,
            'submission-1',
            HostOrderSource::fromJournal(),
        ));
    }

    public function test_the_write_order_names_the_submission_and_holds_no_value(): void
    {
        $order = $this->journal->hostOrdersOf('claude')[1];

        $this->journal->assertResult(
            [HostOrderType::WritePrivate, ['submission' => 'submission-1'], false],
            [$order->type, $this->journal->payloadOf($order), str_contains(
                $order->payload.$order->kept_payload,
                self::VALUE,
            )],
        );
    }
}
