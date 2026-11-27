<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\PullHostPrivateValue\PullHostPrivateValueCommand;
use App\Hosts\Commands\WriteHostPrivateValue\WriteHostPrivateValueCommand;
use App\Terminals\Exceptions\PrivateValueRefused;
use App\Values\HostOrderSource;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A private value reaches only the host its write was ordered on, once: a second pull and another host's pull are
 * refused.
 */
#[TestsCommand(PullHostPrivateValueCommand::class)]
final class PullHostPrivateValueTest extends TestCase
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
            ->submitPrivateValue('submission-1', self::VALUE);
        $process = $this->journal->hostProcessCalled('claude')->id;
        $this->journal->asSystem(new WriteHostPrivateValueCommand($process, 'submission-1', HostOrderSource::fromJournal()));
    }

    public function test_the_host_pulls_the_value_once_and_a_second_pull_is_refused(): void
    {
        $host = $this->journal->hostCalled('Mac')->hostId;
        $pulled = $this->journal->asSystem(new PullHostPrivateValueCommand($host, 'submission-1'));

        $this->journal->assertResult(self::VALUE, $pulled);
        $this->journal->assertRefused(
            PrivateValueRefused::class,
            fn () => $this->journal->asSystem(new PullHostPrivateValueCommand($host, 'submission-1')),
        );
    }

    public function test_another_host_is_refused_the_value(): void
    {
        $this->journal->assertRefused(
            PrivateValueRefused::class,
            fn () => $this->journal->asSystem(
                new PullHostPrivateValueCommand($this->journal->hostCalled('Pi')->hostId, 'submission-1'),
            ),
        );
    }
}
