<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandTransaction;
use Domain\Documents\Commands\AppendUpload;
use Domain\Documents\Commands\BeginUpload;
use Domain\Documents\Commands\CommitUpload;
use Domain\Documents\Commands\DiscardUpload;
use Domain\Documents\Contracts\SealedUploads;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadChunkConflict;
use Domain\Documents\Exceptions\UploadExpired;
use Domain\Documents\Exceptions\UploadIncomplete;
use Domain\Documents\Exceptions\UploadLimitReached;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Models\TextUploadChunk;
use Domain\Documents\Tests\TestCase;
use Illuminate\Database\DatabaseManager;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;

final class TextUploadTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'text_upload_chunks', 'text_uploads', 'links', 'agents', 'agent_sessions', 'start_tokens',
        'agent_stacks', 'command_receipts',
    ];

    public function test_a_large_upload_seals_and_is_consumed_once_as_its_declared_type(): void
    {
        TestStart::start()->startRequest($this->app);
        $part = str_repeat('a', TextUpload::CHUNK_BYTES);
        $text = str_repeat($part, 32);
        $id = $this->begin($text);
        $bus = $this->app->make(CommandBus::class);

        $chunkDigest = hash('sha256', $part);
        for ($index = 0; $index < 32; $index++) {
            $bus->run(new AppendUpload($id, $index, $part, $chunkDigest));
        }
        $bus->run(new AppendUpload($id, 0, $part, $chunkDigest));
        $this->assertSame(32, TextUploadChunk::query()->count());
        $this->assertThrows(
            fn () => $bus->run(new AppendUpload($id, 0, 'different', hash('sha256', 'different'))),
            UploadChunkConflict::class,
        );
        $bus->run(new CommitUpload($id));

        $this->assertThrows(fn () => $this->consume($id, UploadType::ReportBody), UploadExpired::class);
        $this->assertSame($text, $this->consume($id, UploadType::DocumentBody));
        $this->assertThrows(fn () => $this->consume($id, UploadType::DocumentBody), UploadExpired::class);
    }

    public function test_the_limit_and_incomplete_recovery_are_private_to_each_session(): void
    {
        $author = TestStart::start();
        $other = TestStart::start();
        $author->startRequest($this->app);
        $ids = [$this->begin('a'), $this->begin('b'), $this->begin('c'), $this->begin('d')];
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $this->begin('e'), UploadLimitReached::class);
        $this->assertThrows(fn () => $bus->run(new CommitUpload($ids[0])), UploadIncomplete::class);
        $this->assertThrows(fn () => $this->consume($ids[0], UploadType::DocumentBody), UploadIncomplete::class);

        $other->startRequest($this->app);
        $this->assertFalse(TextUpload::query()->whereKey($ids[0])->exists());
        $this->begin('e');
        $this->assertThrows(fn () => $bus->run(new DiscardUpload($ids[0])), UploadExpired::class);

        $author->startRequest($this->app);
        $bus->run(new DiscardUpload($ids[0]));
        $this->begin('f');
    }

    private function begin(string $text): string
    {
        return $this->app->make(CommandBus::class)->run(
            new BeginUpload(UploadType::DocumentBody, strlen($text), hash('sha256', $text)),
        );
    }

    private function consume(string $id, UploadType $type): string
    {
        $this->mock(CommandTransaction::class)->shouldReceive('requireRunning')->once();

        try {
            return $this->app->make(DatabaseManager::class)->connection()->transaction(
                fn () => $this->app->make(SealedUploads::class)->consume($id, $type),
            );
        } finally {
            $this->app->forgetInstance(CommandTransaction::class);
        }
    }
}
