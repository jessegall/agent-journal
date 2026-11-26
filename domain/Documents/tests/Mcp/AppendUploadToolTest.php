<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Mcp\Tools\AppendUploadTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent appends the next piece of text to its upload.
 */
#[TestsMcpTool(AppendUploadTool::class)]
final class AppendUploadToolTest extends McpToolEntryTestCase
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
                'index' => 0,
                'text' => 'notes',
                'digest' => hash('sha256', 'notes'),
                'request_key' => 'documents-1',
            ])
            ->expects(AppendUploadCommand::class, [
                'uploadId' => $upload,
                'index' => 0,
                'text' => 'notes',
            ]);
    }
}
