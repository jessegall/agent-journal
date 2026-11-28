<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Files\Enums\Place;
use App\Hosts\Contracts\HostChannel;
use App\Recordings\RecordingDrafts;
use App\Values\HostInstructionSource;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\Support\Hosts\Exceptions\RecordingDiverged;
use Tests\Support\Hosts\MockHost;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The host channel plays a committed recording: a driver that types what the recording's user typed passes each
 * checkpoint however it splits its writes, and one wrong byte fails naming the checkpoint.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalRecordingsTest extends TestCase
{
    use UsesTemporaryPlaces;

    private const string RECORDING = 'claude-code/2.1.323/turns/terminal-turn';

    public function test_switching_recording_on_lets_a_run_open(): void
    {
        $this->placeInTemporaryFolder(Place::Project);
        $this->journal->switchRecordingOn();

        $this->journal->assertResult(true, $this->journal->service(RecordingDrafts::class)->isOn());
    }

    public function test_a_driver_typing_the_recorded_inputs_passes_every_checkpoint_in_one_or_two_writes(): void
    {
        $this->journal->playRecording(self::RECORDING);

        $this->typeRecordedInputs(fn (string $input) => [$input]);
        $this->journal->playRecording(self::RECORDING);
        $this->typeRecordedInputs(fn (string $input) => str_split($input, max(1, intdiv(strlen($input), 2))));

        $this->journal->mockHost(fn (MockHost $host) => $this->assertNotSame([], $host->recordedInputs()));
    }

    public function test_the_hosts_recorded_answers_read_as_it_wrote_them(): void
    {
        $answers = $this->journal->recordedHostAnswers('claude-code', 'probe-image-missing');

        $this->journal->assertResult(
            [true, true],
            [$answers !== [], in_array('image_fault', array_column($answers, 'refusal'), true)],
        );
    }

    public function test_one_wrong_byte_fails_naming_its_checkpoint(): void
    {
        $this->journal->playRecording(self::RECORDING);

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
        $host = $this->journal->service(MockHost::class);
        $channel = $this->journal->service(HostChannel::class);

        foreach ($host->recordedInputs() as $number => $input) {
            $host->advanceToInput($number);

            foreach ($split($input) as $write) {
                $channel->keys('process', $write, $host->guardFor(0, 1), 0, HostInstructionSource::fromJournal());
            }

            $host->assertTypedThrough($number);
        }
    }
}
