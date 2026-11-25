<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\RecordRunChunk\RecordRunChunkCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Processes\OutputStream;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Runs\AdmitsShellRuns;
use Tests\TestCase;

/**
 * The runner sends a part's output in chunks at their offset, and the journal answers how far it has kept; a chunk
 * sent again at an offset already kept adds nothing.
 */
final class RecordRunChunkTest extends TestCase
{
    use AdmitsShellRuns;
    use RefreshHookDatabase;

    public function test_chunks_are_kept_in_order_and_a_resent_one_adds_nothing(): void
    {
        $run = $this->runningRun();
        $bus = $this->app->make(CommandBus::class);
        $chunk = fn (int $offset, string $text) => $bus->run(
            new RecordRunChunkCommand($run->id, 1, 1, 'cat', OutputStream::Stdout, $offset, base64_encode($text)),
        );

        $this->assertSame(6, $chunk(0, 'hello '));
        $this->assertSame(11, $chunk(6, 'world'));
        $this->assertSame(11, $chunk(0, 'hello '));
    }
}
