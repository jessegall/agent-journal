<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Hosts\Contracts\HostChannel;
use App\Values\HostOrderSource;
use Tests\Support\Hosts\Exceptions\RecordingDiverged;
use Tests\TestCase;

/**
 * The host channel plays a committed recording: a driver that types what the recording's user typed passes each
 * checkpoint however it splits its writes, and one wrong byte fails naming the checkpoint.
 */
final class JournalRecordingsTest extends TestCase
{
    private const string RECORDING = 'claude-code/2.1.323/turns/terminal-turn';

    public function test_a_driver_typing_the_recorded_inputs_passes_every_checkpoint_in_one_or_two_writes(): void
    {
        $this->journal->playsRecording(self::RECORDING);

        $this->typeRecordedInputs(fn (string $input) => [$input]);
        $this->journal->playsRecording(self::RECORDING);
        $this->typeRecordedInputs(fn (string $input) => str_split($input, max(1, intdiv(strlen($input), 2))));

        $this->assertNotSame([], $this->journal->standInHost()->recordedInputs());
    }

    public function test_one_wrong_byte_fails_naming_its_checkpoint(): void
    {
        $this->journal->playsRecording(self::RECORDING);

        $this->journal->assertRefused(
            RecordingDiverged::class,
            fn () => $this->typeRecordedInputs(fn (string $input) => [$input.'x']),
            fn (RecordingDiverged $diverged) => $this->journal->assertResult(0, $diverged->checkpoint),
        );
    }

    /**
     * @param  callable(string): list<string>  $split
     */
    private function typeRecordedInputs(callable $split): void
    {
        $host = $this->journal->standInHost();
        $channel = $this->journal->service(HostChannel::class);

        foreach ($host->recordedInputs() as $number => $input) {
            $host->advanceToInput($number);

            foreach ($split($input) as $write) {
                $channel->keys('process', $write, $host->guardFor(0, 1), 0, HostOrderSource::fromJournal());
            }

            $host->assertTypedThrough($number);
        }
    }
}
