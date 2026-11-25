<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\DiscardUpload\DiscardUploadCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Mcp\Tools\DiscardUploadTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent discards an upload it no longer needs.
 */
#[TestsMcpTool(DiscardUploadTool::class)]
final class DiscardUploadToolTest extends McpToolEntryTestCase
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

        return ToolCall::by($start)
            ->arguments([
                'upload_id' => $upload,
                'request_key' => 'documents-1',
            ])
            ->expects(DiscardUploadCommand::class, ['uploadId' => $upload]);
    }
}
