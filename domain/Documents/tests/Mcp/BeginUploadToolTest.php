<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Mcp\Tools\BeginUploadTool;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent begins an upload of a long text and is given the upload.
 */
#[TestsMcpTool(BeginUploadTool::class)]
final class BeginUploadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');

        return ToolCall::by($start)
            ->arguments([
                'type' => 'document_body',
                'bytes' => 5,
                'digest' => hash('sha256', 'notes'),
                'request_key' => 'documents-1',
            ])
            ->reply(BeginUploadCommand::class, Str::ulid())
            ->expects(BeginUploadCommand::class, [
                'type' => UploadType::DocumentBody,
                'bytes' => 5,
                'digest' => hash('sha256', 'notes'),
            ]);
    }
}
