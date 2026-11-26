<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Mcp\Tools\ReadAttachmentTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads an attachment it uploaded.
 */
#[TestsMcpTool(ReadAttachmentTool::class)]
final class ReadAttachmentToolTest extends McpToolEntryTestCase
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
            new BeginUploadCommand(UploadType::DocumentBody, 5, hash('sha256', 'notes')),
        );

        $journal->runAs('Writer', new AppendUploadCommand($upload, 0, 'notes', hash('sha256', 'notes')));
        $attachment = $journal->runAs('Writer', new CommitUploadCommand($upload));

        return ToolCall::by($start)->arguments(['attachment_id' => $attachment]);
    }
}
