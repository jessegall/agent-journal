<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandTransaction;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Domain\Documents\Commands\DiscardUpload\DiscardUploadCommand;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Exceptions\UploadExpired;
use Domain\Documents\Exceptions\UploadIncomplete;
use Domain\Documents\Exceptions\UploadLimitReached;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Support\UploadStore;
use Domain\Documents\Tests\TestCase;
use Illuminate\Database\DatabaseManager;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestProjects;

#[TestsCommand(DiscardUploadCommand::class)]
final class DiscardUploadTest extends TestCase
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

    public function test_the_limit_and_incomplete_recovery_are_private_to_each_session(): void
    {
        $author = $this->journal->signedStart('Test agent');
        $other = $this->journal->signedStart('Test agent 2');
        $author->startRequest($this->app);

        $ids = [
            $this->begin('a'),
            $this->begin('b'),
            $this->begin('c'),
            $this->begin('d'),
        ];

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

    private function begin(string $text): string
    {
        return $this->app->make(CommandBus::class)->run(
            new BeginUploadCommand(
                UploadType::DocumentBody,
                strlen($text),
                hash('sha256', $text),
                TestProjects::local()->id,
            ),
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
