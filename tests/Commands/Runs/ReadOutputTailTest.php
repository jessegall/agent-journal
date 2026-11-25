<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\ReadOutputTail\ReadOutputTailCommand;
use App\Commands\Runs\RecordRunChunk\RecordRunChunkCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Processes\OutputStream;
use App\Models\CommandRules\EvidenceRead;
use App\Values\PartKey;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent reads the last lines of a part's output, and the bytes it was shown are recorded as its read of the run.
 */
#[TestsCommand(ReadOutputTailCommand::class)]
final class ReadOutputTailTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_last_lines_are_shown_and_their_bytes_recorded_as_the_readers(): void
    {
        $run = $this->journal->owner()->agent('Runner')->actAs('Runner')
            ->processRun('Read', 'cat composer.json')
            ->runningPart('Read', new PartKey(1, 1, 'cat'))
            ->processRunCalled('Read');
        $lines = ['first', 'second', 'third'];
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new RecordRunChunkCommand(
            $run->id,
            1,
            1,
            'cat',
            OutputStream::Stdout,
            0,
            base64_encode(implode("\n", $lines)."\n"),
        ));

        $tail = $bus->run(new ReadOutputTailCommand($run->id, 1, OutputStream::Stdout, 2));

        $this->assertSame(implode("\n", array_slice($lines, 1)), $tail->text);
        $read = EvidenceRead::query()->sole();
        $this->assertSame(
            [$this->journal->agentCalled('Runner')->id, 6, 18],
            [$read->actor_id, $read->first_byte, $read->end_byte],
        );
    }
}
