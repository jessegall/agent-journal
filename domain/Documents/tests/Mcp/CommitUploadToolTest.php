<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Mcp\Tools\CommitUploadTool;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * An agent commits its upload and is given the attachment.
 */
#[TestsMcpTool(CommitUploadTool::class)]
final class CommitUploadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');

        $upload = $journal->runAs(
            'Writer',
            new BeginUploadCommand(UploadType::DocumentBody, 5, hash('sha256', 'notes'), TestProjects::local()->id),
        );

        $journal->runAs('Writer', new AppendUploadCommand($upload, 0, 'notes', hash('sha256', 'notes')));

        return ToolCall::by($start)
            ->arguments([
                'upload_id' => $upload,
                'request_key' => 'documents-1',
            ])
            ->reply(CommitUploadCommand::class, Str::ulid())
            ->expects(CommitUploadCommand::class, ['uploadId' => $upload]);
    }
}
