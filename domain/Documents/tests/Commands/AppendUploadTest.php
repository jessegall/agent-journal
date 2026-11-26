<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\AttachmentReferences;
use App\Data\Messages\MessageAttachmentData;
use App\Exceptions\DriverRequestRefused;
use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestProjects;

#[TestsCommand(AppendUploadCommand::class)]
final class AppendUploadTest extends TestCase
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

    public function test_a_delivery_names_only_an_attachment_its_recipient_can_read_at_that_version(): void
    {
        $recipient = $this->journal->signedStart('Test agent');
        $other = $this->journal->signedStart('Test agent 2');
        $recipient->startRequest($this->app);
        $id = $this->begin('notes');
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new AppendUploadCommand($id, 0, 'notes', hash('sha256', 'notes')));
        $bus->run(new CommitUploadCommand($id));
        $attachments = $this->app->make(AttachmentReferences::class);

        $attachments->assertReadable(
            new MessageAttachmentData($id, hash('sha256', 'notes'), 'notes.md'),
            $recipient->session->id,
        );

        $this->assertThrows(
            fn () => $attachments->assertReadable(
                new MessageAttachmentData($id, hash('sha256', 'notes'), 'notes.md'),
                $other->session->id,
            ),
            DriverRequestRefused::class,
            DriverRequestRefused::attachmentMissing($id)->getMessage(),
        );

        $this->assertThrows(
            fn () => $attachments->assertReadable(
                new MessageAttachmentData($id, 'older', 'notes.md'),
                $recipient->session->id,
            ),
            DriverRequestRefused::class,
            DriverRequestRefused::attachmentChanged($id)->getMessage(),
        );
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
}
