<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Mcp;

use Domain\Questions\Commands\ReadQuestion\ReadQuestionCommand;
use Domain\Questions\Mcp\Tools\QuestionReadTool;
use Domain\Questions\QuestionsDomain;
use Domain\Questions\Tests\Fixtures\QuestionFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads a question asked in its inbox.
 */
#[TestsMcpTool(QuestionReadTool::class)]
final class QuestionReadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(QuestionsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $inbox = $journal->sharedInbox('Owner', 'Planner')->sharedInboxOf('Owner', 'Planner');
        $question = $journal->fixtures(QuestionFixtures::class)
            ->question('Database', $inbox, 'Planner', 'Owner')
            ->questionCalled('Database');

        return ToolCall::by($start)
            ->arguments(['question_id' => $question->id, 'request_key' => 'write-1'])
            ->expects(ExpectedCommand::of(ReadQuestionCommand::class, ['questionId' => $question->id]));
    }
}
