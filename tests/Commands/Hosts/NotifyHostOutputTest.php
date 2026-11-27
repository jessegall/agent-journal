<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Exceptions\HostProtocolRefused;
use App\Hosts\Commands\NotifyHostOutput\NotifyHostOutputCommand;
use App\Hosts\Data\HostOutputData;
use App\Hosts\ProcessFeed;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host's output goes into its process's feed; output of another host's process and output over the post limit are
 * refused, and nothing of either is kept.
 */
#[TestsCommand(NotifyHostOutputCommand::class)]
final class NotifyHostOutputTest extends TestCase
{
    use RefreshHookDatabase;

    private const string FRAME = '{"frames":[{"rows":["ready"],"cursor_row":0,"cursor_column":5,"columns":80,'
        .'"captured":1,"unchanged_ms":[0]}]}';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->enrollHost('Other', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openProcess('shell'));
    }

    public function test_the_output_is_kept_as_the_processs_latest_frame(): void
    {
        $process = $this->journal->hostProcessCalled('shell')->id;

        $this->journal->asSystem(new NotifyHostOutputCommand(
            $this->journal->hostCalled('Mac')->hostId,
            $process,
            self::FRAME,
        ));

        $this->journal->assertResult(
            'ready',
            $this->journal->service(ProcessFeed::class)->latestFrame($process)?->rows[0],
        );
    }

    public function test_output_of_another_hosts_process_or_over_the_limit_is_refused_and_not_kept(): void
    {
        $process = $this->journal->hostProcessCalled('shell')->id;
        $foreign = new NotifyHostOutputCommand($this->journal->hostCalled('Other')->hostId, $process, self::FRAME);
        $tooLarge = str_pad(self::FRAME, HostOutputData::MAXIMUM_BYTES + 1);
        $oversized = new NotifyHostOutputCommand($this->journal->hostCalled('Mac')->hostId, $process, $tooLarge);

        $this->journal
            ->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($foreign))
            ->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($oversized))
            ->assertResult(null, $this->journal->service(ProcessFeed::class)->latestFrame($process));
    }
}
