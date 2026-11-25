<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\RecordRunChunk\RecordRunChunkCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Processes\OutputStream;
use App\Values\PartKey;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The runner sends a part's output in chunks at their offset, and the journal answers how far it has kept; a chunk
 * sent again at an offset already kept adds nothing.
 */
#[TestsCommand(RecordRunChunkCommand::class)]
final class RecordRunChunkTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_chunks_are_kept_in_order_and_a_resent_one_adds_nothing(): void
    {
        $run = $this->journal->owner()->agent('Runner')->actAs('Runner')
            ->processRun('Read', 'cat composer.json')
            ->runningPart('Read', new PartKey(1, 1, 'cat'))
            ->processRunCalled('Read');
        $bus = $this->app->make(CommandBus::class);
        $chunk = fn (int $offset, string $text) => $bus->run(
            new RecordRunChunkCommand($run->id, 1, 1, 'cat', OutputStream::Stdout, $offset, base64_encode($text)),
        );

        $this->assertSame(6, $chunk(0, 'hello '));
        $this->assertSame(11, $chunk(6, 'world'));
        $this->assertSame(11, $chunk(0, 'hello '));
    }
}
