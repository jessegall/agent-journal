<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\AskRawBytes;
use App\Hosts\Protocol\HostProcessType;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * While recording is on, a terminal is opened asking for its raw bytes; with recording off, or for pipes, it is not.
 */
#[TestsMiddleware(AskRawBytes::class)]
final class AskRawBytesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_terminal_asks_for_its_raw_bytes_only_while_recording_is_on(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('before'));
        config(['journal.agents.recording' => true]);
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('recorded')
            ->openProcess('piped', HostProcessType::Pipe));

        $this->assertSame(
            [false, true, false],
            [
                $this->journal->payloadOf($this->journal->hostInstructionsOf('before')[0])['raw_bytes'],
                $this->journal->payloadOf($this->journal->hostInstructionsOf('recorded')[0])['raw_bytes'],
                $this->journal->payloadOf($this->journal->hostInstructionsOf('piped')[0])['raw_bytes'],
            ],
        );
    }
}
