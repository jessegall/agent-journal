<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandTransaction;
use App\Contracts\Drivers\AttachmentReferences;
use App\Data\MessagePartData;
use App\Exceptions\DriverRequestRefused;
use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Domain\Documents\Commands\DiscardUpload\DiscardUploadCommand;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadChunkConflict;
use Domain\Documents\Exceptions\UploadExpired;
use Domain\Documents\Exceptions\UploadIncomplete;
use Domain\Documents\Exceptions\UploadLimitReached;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Models\TextUploadChunk;
use Domain\Documents\Support\UploadStore;
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

    public function test_the_limit_and_incomplete_recovery_are_private_to_each_session(): void
    {
        $author = TestStart::start();
        $other = TestStart::start();
        $author->startRequest($this->app);
        $ids = [$this->begin('a'), $this->begin('b'), $this->begin('c'), $this->begin('d')];
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $this->begin('e'), UploadLimitReached::class);
        $this->assertThrows(fn () => $bus->run(new CommitUploadCommand($ids[0])), UploadIncomplete::class);
        $this->assertThrows(fn () => $this->consume($ids[0], UploadType::DocumentBody), UploadIncomplete::class);

        $other->startRequest($this->app);
        $this->assertFalse(TextUpload::query()->whereKey($ids[0])->exists());
        $this->begin('e');
        $this->assertThrows(fn () => $bus->run(new DiscardUploadCommand($ids[0])), UploadExpired::class);

        $author->startRequest($this->app);
        $bus->run(new DiscardUploadCommand($ids[0]));
        $this->begin('f');
    }

    public function test_a_delivery_names_only_an_attachment_its_recipient_can_read_at_that_version(): void
    {
        $recipient = TestStart::start();
        $other = TestStart::start();
        $recipient->startRequest($this->app);
        $id = $this->begin('notes');
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new AppendUploadCommand($id, 0, 'notes', hash('sha256', 'notes')));
        $bus->run(new CommitUploadCommand($id));
        $attachments = $this->app->make(AttachmentReferences::class);

        $attachments->assertReadable(
            MessagePartData::forAttachment($id, hash('sha256', 'notes'), 'notes.md'),
            $recipient->session->id,
        );

        $this->assertThrows(
            fn () => $attachments->assertReadable(
                MessagePartData::forAttachment($id, hash('sha256', 'notes'), 'notes.md'),
                $other->session->id,
            ),
            DriverRequestRefused::class,
            DriverRequestRefused::attachmentMissing($id)->getMessage(),
        );

        $this->assertThrows(
            fn () => $attachments->assertReadable(
                MessagePartData::forAttachment($id, 'older', 'notes.md'),
                $recipient->session->id,
            ),
            DriverRequestRefused::class,
            DriverRequestRefused::attachmentChanged($id)->getMessage(),
        );
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
