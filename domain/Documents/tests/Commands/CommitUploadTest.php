<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandTransaction;
use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadChunkConflict;
use Domain\Documents\Exceptions\UploadExpired;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Models\TextUploadChunk;
use Domain\Documents\Support\UploadStore;
use Domain\Documents\Tests\TestCase;
use Illuminate\Database\DatabaseManager;
use Tests\Support\CommitsHookRows;

final class CommitUploadTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'text_upload_chunks',
        'text_uploads',
        'links',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'command_receipts',
    ];

    public function test_a_large_upload_seals_and_is_consumed_once_as_its_declared_type(): void
    {
        $this->journal->signedStart('Test agent')->startRequest($this->app);
        $part = str_repeat('a', TextUpload::CHUNK_BYTES);
        $text = str_repeat($part, 32);
        $id = $this->begin($text);
        $bus = $this->app->make(CommandBus::class);

        $chunkDigest = hash('sha256', $part);

        for ($index = 0; $index < 32; $index++) {
            $bus->run(new AppendUploadCommand($id, $index, $part, $chunkDigest));
        }

        $bus->run(new AppendUploadCommand($id, 0, $part, $chunkDigest));
        $this->assertSame(32, TextUploadChunk::query()->count());

        $this->assertThrows(
            fn () => $bus->run(new AppendUploadCommand($id, 0, 'different', hash('sha256', 'different'))),
            UploadChunkConflict::class,
        );

        $bus->run(new CommitUploadCommand($id));

        $this->assertThrows(fn () => $this->consume($id, UploadType::ReportBody), UploadExpired::class);
        $this->assertSame($text, $this->consume($id, UploadType::DocumentBody));
        $this->assertThrows(fn () => $this->consume($id, UploadType::DocumentBody), UploadExpired::class);
    }

    private function begin(string $text): string
    {
        return $this->app->make(CommandBus::class)->run(
            new BeginUploadCommand(UploadType::DocumentBody, strlen($text), hash('sha256', $text)),
        );
    }

    private function consume(string $id, UploadType $type): string
    {
        $this->mock(CommandTransaction::class)->shouldReceive('assertRunning')->once();

        try {
            return $this->app->make(DatabaseManager::class)->connection()->transaction(
                fn () => $this->app->make(UploadStore::class)->consume($id, $type),
            );
        } finally {
            $this->app->forgetInstance(CommandTransaction::class);
        }
    }
}
