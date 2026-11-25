<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Mcp;

use Domain\Questions\Commands\AskQuestion\AskQuestionCommand;
use Domain\Questions\Enums\QuestionType;
use Domain\Questions\Mcp\Tools\QuestionAskTool;
use Domain\Questions\QuestionsDomain;
use Illuminate\Support\Str;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent asks the owner a choice in their shared inbox.
 */
#[TestsMcpTool(QuestionAskTool::class)]
final class QuestionAskToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(QuestionsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $inbox = $journal->sharedInbox('Owner', 'Planner')->sharedInboxOf('Owner', 'Planner');

        return ToolCall::by($start)
            ->arguments(['inbox_id' => $inbox->id, 'target_type' => 'user', 'target_id' => $journal->ownerUser()->id, 'text' => 'Which database?', 'type' => 'choice', 'options' => ['Postgres', 'SQLite'], 'request_key' => 'write-1'])
            ->reply(AskQuestionCommand::class, (string) Str::ulid())
            ->expects(ExpectedCommand::of(AskQuestionCommand::class, ['inboxId' => $inbox->id, 'text' => 'Which database?', 'type' => QuestionType::Choice, 'options' => ['Postgres', 'SQLite']]));
    }
}
